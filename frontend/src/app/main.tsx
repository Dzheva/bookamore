import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from "react-router";
import {router} from "@app/router/router.tsx";

import '@app/styles/globals.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
