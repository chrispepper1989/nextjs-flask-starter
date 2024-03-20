'use client'
import Image from 'next/image'
import Link from 'next/link'


import React from "react";
import LeankitHomecomponent from "@/components/LeankitHomecomponent";
import {useRouter} from "next/router";


export default function Home({searchParams,
                                       }: {
    searchParams: { [key: string]: string | string[] | undefined };
}): React.ReactNode {


    const {apiKey,laneId} =searchParams;
    console.log(searchParams)
    const apiKeyParam = typeof apiKey === 'string' || apiKey instanceof String ? apiKey as string : undefined;
    const laneIdParam = typeof laneId === 'string' || laneId instanceof String ? laneId as string : undefined;
    console.log(apiKeyParam)
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          By{' Christopher Pepper & '}
          <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
          />

          <div>
              <LeankitHomecomponent initialAPIKey={apiKeyParam} initialLaneId={laneIdParam}/>
          </div>
          <br/><br/><br/><br/>
      </main>
  )
}
