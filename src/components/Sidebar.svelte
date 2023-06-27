<script lang="ts">
    import { onMount } from "svelte";
    let text = "";
    onMount(() => {
        // Listen for messages from the extension
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.type) {
                case "onSelectedText": {
                    text = message.value;
                    break;
                }
                case "onSelectedTextToOptimize": {
                    text = "To optimize:" + message.value;
                    // call API 
                    break;
                }
                case "onSelectedTextToRefactor": {
                    text = "To refactor:" + message.value;
                    // call API 
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
