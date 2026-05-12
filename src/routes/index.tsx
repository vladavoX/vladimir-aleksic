import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="bg-muted/10 flex-1 p-8 flex flex-col gap-6">
			<div className="space-y-2">
				<h1 className="text-accent text-2xl">Vladimir Aleksic</h1>
				<p className="text-subtle text-sm">
					Full-Stack Software Developer · Novi Sad, RS
				</p>
			</div>
			<div className="flex items-center gap-2">
				<p className="rounded-sm border border-divider text-xs w-fit h-fit flex items-center">
					<span className="px-2 py-1">role</span>
					<span className="text-accent bg-accent/10 px-2 py-1">full-stack</span>
				</p>
				<p className="rounded-sm border border-divider text-xs w-fit h-fit flex items-center">
					<span className="px-2 py-1">primary</span>
					<span className="text-accent bg-accent/10 px-2 py-1">TypeScript</span>
				</p>
				<p className="rounded-sm border border-divider text-xs w-fit h-fit flex items-center">
					<span className="px-2 py-1">years</span>
					<span className="text-accent bg-accent/10 px-2 py-1">5</span>
				</p>
				<p className="rounded-sm border border-divider text-xs w-fit h-fit flex items-center">
					<span className="px-2 py-1">status</span>
					<span className="text-accent bg-accent/10 px-2 py-1">
						accepting work
					</span>
				</p>
			</div>
			<div className="space-y-2">
				<p className="text-sm max-w-2/3">
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores
					pariatur labore quam nisi nobis earum numquam ipsam voluptates,
					delectus laudantium quibusdam doloribus cumque facere odit dolor
					consequatur similique, molestias et.
				</p>
				<p className="text-sm max-w-2/3">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, quod
					quis vitae quae beatae natus tenetur repellendus excepturi est
					accusamus delectus accusantium eligendi voluptatum, aut officia,
					maiores eveniet magni et.
				</p>
				<p className="text-sm max-w-2/3">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
					voluptas labore aut facilis ratione debitis quae ullam suscipit ad quo
					atque, unde magni, optio accusamus, quasi in laboriosam a modi.
				</p>
			</div>
			<div className="border border-divider p-4 rounded-sm space-y-4">
				<h2 className="text-accent">BY THE NUMBERS</h2>
				<div className="grid grid-cols-2 gap-2">
					<div className="p-4 bg-accent/5 rounded-sm border border-divider"></div>
					<div className="p-4 bg-accent/5 rounded-sm border border-divider"></div>
					<div className="p-4 bg-accent/5 rounded-sm border border-divider"></div>
					<div className="p-4 bg-accent/5 rounded-sm border border-divider"></div>
				</div>
			</div>
			<div className="border border-divider p-4 rounded-sm space-y-4">
				<h2 className="text-accent">QUICK STATS</h2>
				<div className="grid grid-cols-2 gap-2">
					<div className="p-4 bg-black rounded-sm border border-divider"></div>
					<div className="p-4 bg-black rounded-sm border border-divider"></div>
					<div className="p-4 bg-black rounded-sm border border-divider"></div>
					<div className="p-4 bg-black rounded-sm border border-divider"></div>
				</div>
			</div>
		</div>
	);
}
