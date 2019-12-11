import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {toast} from "react-toastify"
import "whatwg-fetch"
import "react-toastify/dist/ReactToastify.css"

import serviceWorker from "./shared/service-worker"
import Loader from "./async/loader"
import App from "./app"
import "./shared/i18n"
import "./shared/base.scss"

toast.configure({position: "bottom-right"})

ReactDOM.render(
  <Suspense fallback={<Loader />}>
    <App />
  </Suspense>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
