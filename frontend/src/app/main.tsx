import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from "react-router";
import {router} from "@app/router/router.tsx";
import {Provider as ReduxProvider} from "react-redux";

import '@app/styles/globals.css'
import {store} from "@app/store/store.ts";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ReduxProvider store={store}>
          <RouterProvider router={router} />
      </ReduxProvider>
  </StrictMode>,
)
