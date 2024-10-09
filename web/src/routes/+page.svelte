<script>
    import { page } from '$app/stores';
    import { generateQuery } from '$lib/scripts/utils';

    let types = "{overlay}"
    let username = "{username}"
    let user = "Dinnerbone"
    let overlay = "normal"
    let url = ""

    let no_bg = false;
    let flip = false;
    let namemc = false;

    let color1 = ""
    let color2 = ""

    let props = "";

    let query = ""
    $: query = generateQuery([
        { url },
        { namemc: namemc ? "true" : "" },
        { flip: flip ? "true" : "" },
        { "no-background": no_bg ? "true" : "" },
        { "props": props.length ? props.join(",") : "" },
        { "gradient": !no_bg && color1 && color2 ? `${color1.replace("#", "")}-${color2.replace("#", "")}` : "" }
    ])
</script>
<main>
    <h2><img class="img" src="https://minotar.net/avatar/Suss" alt="steve :)"> mcpfp - modified</h2>
    <h3>a modifed version of <a href="https://github.com/MauritsWilke/mcpfp">MauritsWilke/mcpfp</a> to use custom image gen</h3>

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
        <p>Example: <code class="link">{$page.url}api/pfp/{overlay}/{user}.png{query}</code></p>
        <div class="box">
            <div class="imgbox">
                <img src="{$page.url}api/pfp/{overlay}/{user}.png{query}" alt="">
                <div class="box2">
                    <p>Username</p>
                    <input type="text" bind:value={user}>
                    <p>Overlay</p>
                    <select name="types" id="types" bind:value={overlay}>
                        <option value="normal">normal</option>
                        <option value="warn">warn</option>
                        <option value="mute">mute</option>
                        <option value="jail">jail</option>
                        <option value="ban">ban</option>
                    </select>

                    <p>Props</p>
                    <select name="props" id="props" multiple bind:value={props}>
                        <option value="rose">Rose</option>
                        <option value="crown">Crown</option>
                        <option value="labcoat">Labcoat</option>
                        <option value="batman">Batman</option>
                    </select>

                    <p>Use URL</p>
                    <input type="text" bind:value={url}>

                </div>
                <div class="box3">
                    <p>Gradient</p>
                    <input type="color" bind:value={color1}>
                    <input type="color" bind:value={color2}>

                    <p>No Background?</p>
                    <input type="checkbox" bind:checked={no_bg} />

                    <p>NameMC skin?</p>
                    <input type="checkbox" bind:checked={namemc} />
                </div>
            </div>
        </div>
        <p>You can find the source code here: <a target="_blank" href="https://github.com/towsifkafi/mcpfp">https://github.com/towsifkafi/mcpfp</a></p>
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
    img { height: 300px; width: 300px; margin-right: 20px; }
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

    .imgbox { margin-top: 20px; margin-bottom: 10px; display: flex; }
    .box2 { padding-top: 0px; }
    .box3 { margin-left: 25px }

    input, select {
        padding: 2px;
        border: none;
        border-radius: 0;
        color: white;
        font-family: 'Roboto', sans-serif;
        background-color: #1d1d1d;
    }

    select {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: #2c2c2c;
        border-radius: 0px;
    }


</style>