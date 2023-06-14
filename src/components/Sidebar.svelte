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

<span>
    {text}
</span>