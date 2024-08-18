"use client";

import ResponsiveAppBar from "@/components/app-bar";
import { usePathname } from "next/navigation";

// Assuming you have an array of supported languages
const supportedLanguages = ["en", "ar"]; // Add more languages as needed
const hideNavBarRoutes = ["/sign-in", "/sign-up"]; // Routes without language prefix

const ConditionalAppBar = () => {
  const pathname = usePathname();

  // Extract the first segment after the "/" which should be the language code
  const pathSegments = pathname.split("/").filter(Boolean);
  const languageCode = supportedLanguages.includes(pathSegments[0])
    ? pathSegments.shift()
    : null;

  const normalizedPath = `/${pathSegments.join("/")}`;

  // Check if the normalized path matches any of the routes where the nav bar should be hidden
  if (hideNavBarRoutes.includes(normalizedPath)) {
    return null;
  }

  return <ResponsiveAppBar />;
};

export default ConditionalAppBar;
