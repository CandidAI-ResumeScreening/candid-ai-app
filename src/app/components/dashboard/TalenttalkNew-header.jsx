"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Bell, User } from "lucide-react";
import useUserStore from "@/store/useUserStore";
import LogoutButton from "../logout-components/logout-button";
import * as React from "react";

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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    title: "Talent Talk",
    href: "/dashboard/talenttalk-new",
    description:
      "Talk to our chatbot TalentTalk to get more insights on the candidates.",
  },
  // {
  //   title: "Recent Applications",
  //   href: "/dashboard/applications",
  //   description:
  //     "See recent applications for the jobs you posted and converse with our chatbot TalentTalk to get more insights on the candidates.",
  // },
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
    title: "Terms and Policies",
    href: "/dashboard/termsAndPolicies",
    description: "View our terms and policies.",
  },
];

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between border-b border-gray-200 lg:border-none">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center cursor-pointer"
            >
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
                        "text-gray-500 hover:text-gray-700 font-medium"
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
                    <NavigationMenuTrigger className="border-blue-500 text-gray-900 border-b-2 font-medium">
                      Talent Talk
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

          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">HR</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium pb-2 text-gray-800 group-hover:text-gray-900">
                  {user?.email || "HR User"}
                </p>
                <LogoutButton />
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="py-4 flex flex-wrap justify-center space-y-2 lg:hidden">
            <Link
              href="/dashboard"
              className="w-full px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800"
            >
              Dashboard
            </Link>

            {/* Jobs Accordion */}
            <div className="w-full">
              <Accordion type="single" collapsible>
                <AccordionItem value="jobs" className="border-0">
                  <AccordionTrigger className="w-full px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 flex justify-between cursor-pointer">
                    Jobs
                  </AccordionTrigger>
                  <AccordionContent className="border-0 pt-0">
                    {jobOptions.map((option) => (
                      <Link
                        key={option.title}
                        href={option.href}
                        className="w-full px-8 py-2 text-base font-medium text-gray-600 hover:text-gray-800 block"
                      >
                        {option.title}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Candidates Accordion */}
            <div className="w-full">
              <Accordion type="single" collapsible>
                <AccordionItem value="candidates" className="border-0">
                  <AccordionTrigger className="w-full px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 flex justify-between cursor-pointer">
                    Talent Talk
                  </AccordionTrigger>
                  <AccordionContent className="border-0 pt-0">
                    {candidateOptions.map((option) => (
                      <Link
                        key={option.title}
                        href={option.href}
                        className="w-full px-8 py-2 text-base font-medium text-gray-600 hover:text-gray-800 block"
                      >
                        {option.title}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <Link
              href="/dashboard/insights"
              className="w-full px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800"
            >
              Insights
            </Link>

            {/* Account Accordion */}
            <div className="w-full">
              <Accordion type="single" collapsible>
                <AccordionItem value="account" className="border-0">
                  <AccordionTrigger className="w-full px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 flex justify-between cursor-pointer">
                    Account
                  </AccordionTrigger>
                  <AccordionContent className="border-0 pt-0">
                    {accountOptions.map((option) => (
                      <Link
                        key={option.title}
                        href={option.href}
                        className="w-full px-8 py-2 text-base font-medium text-gray-600 hover:text-gray-800 block"
                      >
                        {option.title}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="w-full px-4 py-2 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.email || "HR User"}
                </p>
                <LogoutButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
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
