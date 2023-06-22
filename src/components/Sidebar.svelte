<script lang="ts">
    import { onMount } from "svelte";
    let text = "";
    function fetchText() {
        // send message to the extension asking for the selected text
        tsvscode.postMessage({ type: "onFetchText", value: "" });
    }
    onMount(() => {
        // Listen for messages from the extension
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.type) {
                case "onSelectedText": {
                    text = message.value;
                    break;
                }
            }
        });
    });
</script>

<style>
    div{
        resize: "vertical";
        min-width: "30";
        max-width: 500px;
    }
</style>

<div>{text}</div>
