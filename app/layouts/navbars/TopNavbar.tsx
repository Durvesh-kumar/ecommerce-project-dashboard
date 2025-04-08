"use client"
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useState } from "react";
import { ModeToggle } from "../themes/ModeToggle";
import { Button, buttonVariants } from "@/components/ui/button";
// import HomeLogo from "@/app/logo/home.d";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import HomeLogo from "../logos/home.d";
import NavLinks from "./components/NavLinks";
import LogoutButton from "./components/LogoutButton";

export default function TopNavbar() {
  const pathName = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession()
 
  return (
    <div
      className="flex relative items-center justify-between min-h-16 dark:text-foreground text-muted-foreground 
           bg-primary/5 dark:bg-secondary/30 py-2 px-5 border-b-2 border-separate
           border-[1px] shadow-md shadow-blue-900 min-w-full"
    >
      <HomeLogo />
      <div className="flex items-center gap-4 justify-between max-md:hidden">
        {NavLinks.map((items) => (
          <Link
            href={items.link}
            className={buttonVariants({
              variant: pathName === items.link ? "activeItme" : "item",
            })}
            key={items.lable}
          >
            {/* {items.icon} */}
            {items.lable}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 justify-between">
        <div className="md:hidden">
          <Button
            variant={"outline"}
            className="w-fit p-3"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu />
          </Button>
          {isOpen && (
            <Card className=" absolute flex items-center justify-center top-16 bg-primary/5 dark:bg-secondary/30 right-1 gap-4 w-48 z-50">
              <CardContent className="flex flex-col mt-6 gap-4 items-start justify-start">
                {NavLinks.map((link) => (
                  <Link
                    href={link.link}
                    key={link.lable}
                    onClick={() => setIsOpen(false)}
                    className={` ${buttonVariants({
                      variant:
                        pathName === link.link ? "activeItmes" : "items",
                    })}`}
                    
                  >
                    {/* {link.icon} */}
                    {link.lable}
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-x-5">
          <div>             {!session?.user ? (
              <Link href={"/sign-in"}>
                <div className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md text-nowrap">
                  Sign In
                </div>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none">
                  <div>
                    {session?.user?.image ? (
                      <Image
                        src={session?.user?.image}
                        alt="user"
                        width={30}
                        height={30}
                        className="rounded-full object-scale-down"
                      />
                    ) : (
                      <div className="p-1 flex items-center justify-center w-10 h-10 bg-muted-foreground text-primary-foreground dark:text-white rounded-full border-2 border-blue-600 file:shadow-sm">
                        <span className="text-xl">
                          {session?.user?.name?.slice(0, 1)}
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer flex items-center justify-center"><LogoutButton/></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <ModeToggle />
        </div>

        
      </div>

    </div>
  );
}