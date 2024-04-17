<script>
    import { page } from '$app/stores';
    let types = "{type}"
    let username = "{username}"
    let user = "Dinnerbone"
    let type = "normal"
    let data = ""
</script>
<main>
    <h2><img class="img" src="https://minotar.net/avatar/Suss" alt="steve :)"> mcpfp - modified</h2>
    <h3>a modifed version of <a href="">MauritsWilke/mcpfp</a> to use custom image gen</h3>

    <div class="docs">
        <h3>Base URL</h3>
        <p>Base URL for all endpoints</p>
        <code class="url">{$page.url}</code>
    </div>
    <div class="docs">
        <h3>Endpoints</h3>
        <p>Minecraft full body skin image with types for custom img gen</p>
        <code class="get">GET /api/pfp/{types}/{username}.png</code>
        <p>Available types: <code>normal</code>,<code>warn</code>,<code>mute</code>,<code>jail</code>,<code>ban</code>,<code>kick</code></p>
        <p>Example: <code class="link">{$page.url}api/pfp/{type}/{user}.png{data ? `?data=${data}` : ``}</code></p>
        <div class="box">
            <img src="{$page.url}api/pfp/{type}/{user}.png{data ? `?data=${data}` : ``}" alt="">
            <div class="box2">
                <p>Username</p>
                <input type="text" bind:value={user}>
                <p>Type</p>
                <select name="types" id="types" bind:value={type}>
                    <option value="normal">normal</option>
                    <option value="warn">warn</option>
                    <option value="mute">mute</option>
                    <option value="jail">jail</option>
                    <option value="ban">ban</option>
                </select>
                <p>Data</p>
                <input type="text" bind:value={data}>
            </div>
        </div>
    </div>

</main>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
    :global(body) {
        background-color: rgba(0, 0, 0, 0.946);
        color: #fff;
        font-family: 'Roboto', sans-serif;
    }
    main { margin-left: 20px; margin-top: 20px; }
    .img { width: 25px; height: 25px; margin-right: 5px; }
    img { width: 200px; margin-right: 20px; }
    h2 { display: flex; align-items: center; }
    h2,h3 { margin-block-start: 0em; margin-block-end: 0.4em; }
    p { margin-block-start: 0.6em; margin-block-end: 0.6em; }

    a:link,a:visited,a:hover,a:active { text-decoration: none; }
    a { color: #ff9795; &:visted { color: #95ffb7 } }

    .docs { margin-top: 30px; }
    code { padding: 5px; border-radius: 3px; }
    .url { color: #ffd595; background-color: #1d1d1d; }
    .get { color: #ff9795; background-color: #1d1d1d; }
    .link { color: #95ffe3; background-color: #1d1d1d; }

    .box { margin-top: 20px; display: flex; }
    .box2 { padding-top: 0px; }

    input, select {
        padding: 2px;
        border: none;
        border-radius: 0;
        color: white;
        font-family: 'Roboto', sans-serif;
        background-color: #1d1d1d;
    }


</style>