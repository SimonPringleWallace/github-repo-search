'use client';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IPaginationData, ISort, ITableFilterValue, ITableSortKeys } from "./interfaces";
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from "react";
import { dateFormatter } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IUser {
  login: string;
  avatar_url: string;
}

interface IUserSearchResult {
  users: IUser[];
  setUser: (user: string) => void;
	ref: React.RefObject<HTMLDivElement | null>;
}

export const UserSearchResults = ({ users, ref, setUser }: IUserSearchResult) => {
	
	if(!users) return null;

  return (
    <div ref={ref} className="h-96 w-64 overflow-x-auto absolute z-30 bg-slate-50">
      {users.map((user) => (
        <div
          className="flex justify-start items-center cursor-pointer my-4"
          key={user.login}
          onClick={() => setUser(user.login)}
        >
          <img
            className="rounded-full h-10 w-10 mr-4"
            src={user.avatar_url}
            alt={user.login}
          />
          <p>{user.login}</p>
        </div>
      ))}
    </div>
  );
};

