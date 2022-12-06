import Urbit from '@urbit/http-api';
import React from 'react';
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import './index.css';
import { Curator } from './pages/curator/Curator';
import { CuratorMe } from './pages/curator/CuratorMe';
import { DeveloperApplications } from './pages/curator/DeveloperApplications';
import { Developer } from './pages/developer/Developer';
import { UploadApplication } from './pages/developer/UploadApp';
import { ApplicationPage } from './pages/user/ApplicationPage';
import { CuratorPage } from './pages/user/CuratorPage';
import { User } from './pages/user/User';
import { UserCurators } from './pages/user/UserCurators';
const api = new Urbit('', '', window.desk);
api.ship = window.ship;

/* 
  We'll have to create 3 main routes for each page
  and child routes for each page as many sidebar buttons they have
*/
const router = createBrowserRouter([
  {
    path: '/apps/app-store/usr',
    element: <User />
  },
  {
    path: 'apps/app-store/usr/curs',
    element: <UserCurators />
  },
  {
    path: 'apps/app-store/usr/curs/:curator',
    element: <CuratorPage />
  },
  {
    path: '/apps/app-store/cur',
    element: <Curator />
  },
  {
    path: '/apps/app-store/cur/me',
    element: <CuratorMe />
  },
  {
    path: 'apps/app-store/usr/apps/:application',
    element: <ApplicationPage />
  },
  {
    path: '/apps/app-store/cur/devs/:developer',
    element: <DeveloperApplications />
  },
  {
    path: '/apps/app-store/dev',
    element: <Developer />
  },
  {
    path: '/apps/app-store/dev/upload-app',
    element: <UploadApplication />
  }
]);

export function App () {
  return (
    <React.Fragment>
      <RouterProvider router={router} />  
    </React.Fragment>
  );
}

// Example function call api
// async function init() {
//   return (await api.scry(scryCharges)).initial;
// }