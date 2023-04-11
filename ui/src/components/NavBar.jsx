import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { sigil, reactRenderer } from "@tlon/sigil-js";
import { usePortal } from "@state/usePortal";

const GROUP_FLAG = "~worpet-bildet/portal";

const buildNav = myShip => {
  const defaultListUrl = `/list/${encodeURIComponent(
    `/~${myShip}/list/list/2000.1.1`
  )}/edit`;

  const nav = [
    {
      name: "New Post",
      href: defaultListUrl,
    },
    {
      name: "Home",
      href: `/~worpet-bildet`,
    },
    {
      name: "Feed",
      href: `/feed`,
      dot: true,
    },
    {
      name: "User Index",
      href: `/index`,
    },
    {
      name: "Feedback",
      href: `${window.location.origin}/apps/groups/groups/~worpet-bildet/portal/channels/chat/~worpet-bildet/feedback---support`,
    },
    {
      name: "My Profile",
      href: `/~${myShip}`,
    },
  ];
  return nav;
};

export default function NavBar() {
  let { ship, urbit } = usePortal();
  const [navigation, setNavigation] = useState(buildNav());

  useEffect(() => {
    if (!ship) return;
    setNavigation(buildNav(ship));
  }, [ship]);

  const joinFeedbackGroup = async redirectTo => {
    urbit.poke({
      app: "groups",
      mark: "group-join",
      json: {
        flag: GROUP_FLAG,
        "join-all": true,
      },
      onError: () => reject(),
      onSuccess: () => {
        window.open(redirectTo, "_blank");
      },
    });
  };

  const NavDot = () => {
    return <div className="rounded-2xl bg-blue-500 absolute top-1 right-1 h-2 w-2"></div>;
  };

  const MySigil = () => {
    // sigil-js can't render moons
    return (
      <NavLink to={`~${ship}`} key={ship}>
        {sigil({
          patp: ship?.length < "14" ? ship : "worpet-bildet",
          renderer: reactRenderer,
          size: "50",
          colors: ["black", "white"],
        })}
      </NavLink>
    );
  };

  return (
    <Disclosure as="nav" className="bg-black sticky top-0 z-[100]">
      {({ open }) => (
        <>
          <div className="px-2 sm:px-5 lg:px-24">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-row w-full items-center justify-between">
                <div className="flex flex-row justify-between">
                  <NavLink
                    className="flex items-center cursor-pointer pl-2"
                    to={navigation[1]?.href}
                  >
                    <img
                      className="block h-12 w-auto lg:hidden"
                      src="https://toptyr-bilder.nyc3.cdn.digitaloceanspaces.com/logo2.svg"
                      alt="Portal Logo"
                    />
                    <img
                      className="hidden h-14 w-auto lg:block"
                      src="https://toptyr-bilder.nyc3.cdn.digitaloceanspaces.com/logo2.svg"
                      alt="Portal Logo"
                    />
                    <h2 className="flex flex-1 text-lg font-michroma leading-8 pb-1 pl-2 tracking-tight text-white cursor-pointer">
                      Portal
                    </h2>
                  </NavLink>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 items-center">
                    {navigation.map(item =>
                      item.name === "Feedback" ? (
                        <a
                          key={item.name}
                          className={
                            "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                          }
                          onClick={() => joinFeedbackGroup(item.href)}
                        >
                          Feedback
                        </a>
                      ) : (
                        <div key={item.name}>
                          <NavLink
                            to={item.href}
                            className={
                              "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium relative"
                            }
                          >
                            {item.dot ? <NavDot /> : <></>}
                            {item.name}
                          </NavLink>
                        </div>
                      )
                    )}
                    <div>
                      <MySigil />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden text-right">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map(item =>
                item.name === "Feedback" ? (
                  <div className="w-full flex flex-row justify-end" key={item.name}>
                    <a
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                      onClick={() => {
                        joinFeedbackGroup(item.href);
                      }}
                    >
                      Feedback
                    </a>
                  </div>
                ) : (
                  <div key={item.name}>
                    <NavLink
                      to={item.href}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.name}
                    </NavLink>
                  </div>
                )
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}