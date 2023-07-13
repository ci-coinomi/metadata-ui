<template>
  <main
    class="flex flex-col justify-center items-center gap-6 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <section class="flex flex-col justify-center items-center gap-6 w-4/5">
      <article
        class="flex flex-col gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-3 w-full"
      >
        <h2 class="text-lg font-bold">
          The APP_SETTING type controls NFT marketplace links, Buy and Swap
          features.
        </h2>
        <div>
          <h3>
            <b>Question: </b>If the app only looks for "marketplace", "buy" and
            "kdswap" feature names, is changing the name functionally the same
            as deleting the entry? So we should be extra careful about what we
            change? Or possible improvement: make it a dropdown list with fixed
            options.
          </h3>
          <p>
            <b>Answer: </b>Yes, exactly. those names should be made
            non-editable, imo.
          </p>
        </div>
        <div>
          <h3>
            <b>Question: </b>By default every build has everything active,
            unless the build number is listed there? There's a toggle switch
            labeled "visible", does it do anything? Does it invert the logic to
            "all hidden by default except these build numbers"?
          </h3>
          <p>
            <b>Answer: </b>You got it. basically the "visible" flag is saying
            what adding a build number will do, ie with visible=false adding the
            build number will hide the feature and visible=true will show it (in
            theory at least)
          </p>
        </div>
      </article>

      <article
        class="flex flex-col gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-3 w-full"
      >
        <h2 class="text-lg font-bold">PARTNER type</h2>
        <div>
          <h3><b>Question: </b>What does the PARTNER type do?</h3>
          <p>
            <b>Answer: </b>AFAIK partner entries are mapping from eucId to
            partner Id for assets. Probably don't need to edit those for Koala
            or websites. It's for backend
          </p>
        </div>
      </article>

      <article
        class="flex flex-col gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-3 w-full"
      >
        <h2 class="text-lg font-bold">ASSET type</h2>
        <div>
          <h3>
            <b>Question: </b>Some assets have associated svg and png image
            files. The svg doesn't seem necessary or used anywhere in the app,
            is that right?
          </h3>
          <p>
            <b>Answer: </b>I think you're right, we probably don't need the
            svgs. we just pulled those over since they were there already
          </p>
        </div>
        <div>
          <h3>
            <b>Question: </b>Looks like it's a rule that the image filename must
            be the same as the config name, is that right? (e.g.
            asset_kadenawrapped-usdc must have the image
            asset_kadenawrapped-usdc.png)
          </h3>
          <p>
            <b>Answer: </b>The filenames aren't used to link images, we just
            gave them descriptive defaults. should work no matter what they're
            called (but please test this)
          </p>
        </div>
        <div>
          <h3>
            <b>Question: </b>What does the "tags" property do? They all look
            tagged as "token", is it an important metadata used by the app, or
            just meta-metadata for organization purposes?
          </h3>
          <p>
            <b>Answer: </b>Tags are purely informational at this point and can
            be used if we want to put assets in certain categories (like PoW,
            PoS, L1, L2, etc.)
          </p>
        </div>
      </article>

      <article
        class="flex flex-col gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-3 w-full"
      >
        <h2 class="text-lg font-bold">BANNER type</h2>
        <div>
          <h3>
            <b>Question: </b>There's no button to add a new config. If we
            wanted, say, a new banner, should we open any current banner, clone
            it, then edit the clone?
          </h3>
          <p><b>Answer: </b>Yes</p>
        </div>
      </article>

      <article
        class="flex flex-col gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-3 w-full"
      >
        <h2 class="text-lg font-bold">General</h2>
        <div>
          <h3>
            <b>Question: </b>If we play with if and mess something up, will it
            only visible on the beta version of the app, because it's dev
            environment? Will any change reflect in the explorer as well?
          </h3>
          <p>
            <b>Answer: </b>Any applicable changes on dev would be visible on
            dev-explorer and local KW builds. alpha/beta builds point to staging
            now.
          </p>
        </div>
      </article>
    </section>
  </main>
</template>
<script setup>
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();

onMounted(() => {
  store.setHeaderTitle(`FAQ`);
});
</script>
<style scoped></style>
