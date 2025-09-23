// src/main.tsx
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<HashRouter>
			<App />
		</HashRouter>
	</QueryClientProvider>
);
