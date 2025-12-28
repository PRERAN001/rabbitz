"use client";
import React from 'react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/server';
import { useTRPC } from '@/trpc/client';
import { tr } from 'date-fns/locale';
import {useQuery} from '@tanstack/react-query';
const page = () => {
   const trpcClient = useTRPC();
    const {data} = useQuery(trpcClient.hello.queryOptions({text:"hello"}))
  return (
   
    <div>
      {JSON.stringify(data)}
      <Button>Click me</Button>
    </div>
  )
}

export default page
