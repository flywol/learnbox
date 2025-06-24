import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { HydrationGate } from "./components/HydrationGate";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<HydrationGate>
				<App />
			</HydrationGate>
		</BrowserRouter>
	</React.StrictMode>
);
