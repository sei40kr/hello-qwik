import { component$, useResource$, useStore } from "@builder.io/qwik";

export default component$(() => {
	const github = useStore({
		org: "BuilderIO",
	});

	const reposResource = useResource$<string[]>(({ track, cleanup }) => {
		track(() => github.org);

		const controller = new AbortController();
		cleanup(() => controller.abort());

		return getRepositories(github.org, controller);
	});

	console.log("Render");
	return (
		<main>
			<p>
				<label>
					GitHub username:
					<input
						value={github.org}
						onInput$={(_, el) => {
							github.org = el.value;
						}}
					/>
				</label>
			</p>
			<section>
			</section>
		</main>
	);
});

export async function getRepositories(
	username: string,
	controller?: AbortController,
): Promise<string[]> {
	console.log("FETCH", `https://api.github.com/users/${username}/repos`);
	const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
		signal: controller?.signal,
	});
	console.log("FETCH resolved");
	const json = await resp.json();
	return Array.isArray(json)
		? json.map((repo: { name: string }) => repo.name)
		: [];
}
