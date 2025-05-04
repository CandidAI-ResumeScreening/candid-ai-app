"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Job post options
const jobOptions = [
  {
    title: "Create Job Post",
    href: "/dashboard/jobs/create",
    description:
      "Create an available job post that will appear on the applicants side on our home page for people to apply to.",
  },
  {
    title: "View Job Posts",
    href: "/dashboard/jobs/view",
    description:
      "Edit job posts, view jobs you've created and view the applicants that have applied under these jobs.",
  },
];

// Candidate options
const candidateOptions = [
  {
    title: "View Recent Applications",
    href: "/dashboard/candidates/applications",
    description:
      "See any recent applications for the jobs you posted and converse with our chatbot TalentTalk to get more insights on the candidates.",
  },
];

// Account options
const accountOptions = [
  {
    title: "Settings",
    href: "/dashboard/account/settings",
    description:
      "Update your profile and account details to keep your information current.",
  },
  {
    title: "Billing",
    href: "/dashboard/account/billing",
    description:
      "Manage your payment information and update your billing details.",
  },
];

export function DashboardNavigationMenu() {
  return (
    <div className="flex items-center">
      <Link href="/dashboard" className="flex items-center cursor-pointer">
        <span className="text-2xl font-bold text-blue-600">CandidAI</span>
      </Link>
      <div className="hidden ml-10 lg:block">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "border-blue-500 text-gray-900 border-b-2 font-medium"
                )}
              >
                <Link href="/dashboard">Dashboard</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-500 hover:text-gray-700 font-medium">
                Jobs
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]">
                  {jobOptions.map((option) => (
                    <ListItem
                      key={option.title}
                      title={option.title}
                      href={option.href}
                    >
                      {option.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-500 hover:text-gray-700 font-medium">
                Candidates
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  {candidateOptions.map((option) => (
                    <ListItem
                      key={option.title}
                      title={option.title}
                      href={option.href}
                    >
                      {option.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-gray-500 hover:text-gray-700 font-medium"
                )}
              >
                <Link href="/dashboard/insights">Insights</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-500 hover:text-gray-700 font-medium">
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  {accountOptions.map((option) => (
                    <ListItem
                      key={option.title}
                      title={option.title}
                      href={option.href}
                    >
                      {option.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
