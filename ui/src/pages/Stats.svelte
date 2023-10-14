<script lang="ts">
  import { afterUpdate } from 'svelte';

  import { FeedItem, ItemKey } from '$types/portal/item';

  import { api, me } from '@root/api';
  import config from '@root/config';
  import { getGlobalFeed, getReplies, state } from '@root/state';

  import { fromUrbitTime } from '@root/util';

  let feed: FeedItem[] = [];
  let loading: boolean;

  const subToGlobalFeed = (): void => {
    return api.portal.do.subscribe({
      struc: 'feed',
      ship: config.indexer,
      cord: '',
      time: 'global',
    });
  };

  const globalFeed = (): FeedItem[] => getGlobalFeed();

  let postsByDate = new Map();
  let postersByDate = new Map();
  let csv = 'date,postCount,uniquePosters';
  let blob = new Blob();
  let downloadURL = '';
  let dataLoaded = false;

  state.subscribe((s) => {
    if (!s.isLoaded) return;
    if (s.isLoaded && !getGlobalFeed()) {
      return subToGlobalFeed();
    }

    feed = globalFeed()
      .filter(a => !!a)
      .filter(
        (a, idx) => globalFeed().findIndex((b) => b.time === a.time) === idx
      )
      .sort((a, b) => fromUrbitTime(b.time) - fromUrbitTime(a.time))

    const allPostsAndReplies = new Set(feed);

    const mine = r => {
      allPostsAndReplies.add(r);

      const replies = getReplies(r);
      if (Array.isArray(replies)) {
        replies.forEach(r => mine(r));
      }
    }
    feed.forEach(r => mine(r))

    // now I have all of the replies on the feed, including their replies.
    // let's segment this list according to the day and month of the post.

    // ignore anything older than one month
    const cutoff = new Date() - 30 * 24 * 60 * 60 * 1000;
    [...allPostsAndReplies].forEach(r => {
      const t = new Date(fromUrbitTime(r.time))
      if (t < cutoff) {
        return;
      }
      const ymd = t.toISOString().split('T')[0];
      if (postsByDate.has(ymd)) {
        postsByDate.set(ymd, postsByDate.get(ymd).add(r));
      } else {
        postsByDate.set(ymd, new Set([r]));
      }
    })

    postsByDate.forEach((postSet, postDate) => {
      const posters = new Set([...postSet].map(r => r.ship))
      postersByDate.set(postDate, posters.size)
    });

    postsByDate.forEach((postSet, postDate) => {
      const line =
        `${postDate},${postSet.size},${postersByDate.get(postDate)}`;
      csv = `${csv}\r\n${(line)}`;
    });

    blob = new Blob(["\ufeff", csv]);
    downloadURL = URL.createObjectURL(blob);
    dataLoaded = true;

    if (
      feed[0] &&
      fromUrbitTime(feed[0].time) < Date.now() - 1000 * 60 * 60 * 6
    ) {
      subToGlobalFeed();
    }
  });
</script>

<div class="grid grid-cols-12 gap-8 mb-4 h-full">
  <div class="flex flex-col gap-8 rounded-t-2xl col-span-12 md:col-span-7">
    Hi we're doing stats
    {#if dataLoaded}
      <a href={downloadURL} download=portal_stats.csv>
        Download .csv
      </a>
      <table>
        <thead>
          <tr>
            <th>
              Date
            </th>
            <th>
              Post Count
            </th>
            <th>
              Unique Posters
            </th>
          </tr>
        </thead>
        <tbody>
          {#each [...postsByDate.keys()] as date (date)}
            <tr>
              <td class="border padding-2">
                {date}
              </td>
              <td class="border padding-2">
                {postsByDate.get(date).size}
              </td>
              <td class="border padding-2">
                {postersByDate.get(date)}
              </td>
            </tr>
          {/each}
        </tbody>      
      </table>
    {/if}
  </div>
</div>
