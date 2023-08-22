<script>
  import { createAccount, getMessages, getMessage } from "./lib/mailer.js";

  let account;
  let messages = [];
  let lastupdate = 0;

  async function getAccount() {
    account = await createAccount();
    console.log(account);
  }

  async function refreshMessage() {
    messages = await getMessages(account.token);
    lastupdate = new Date();
    console.log(messages);
  }

  async function showContent(id) {
    let m = messages.find((x) => x.id === id);
    if (!m.content) {
      m.content = await getMessage(id, account.token);
    }
    m.show = true;
    messages = [...messages];
  }

  async function hideContent(id) {
    let m = messages.find((x) => x.id === id);
    m.show = false;
    messages = [...messages];
  }
</script>

<main>
  <h1>Temp Email</h1>
  {#if account?.address}
    <div class="account-box">
      <div class="email">
        <span class="text">{account.address}</span>
      </div>
    </div>
    <button class="btn" on:click={refreshMessage}>📩 Get Message</button>
    {#if lastupdate}
      <small>Last updated: {lastupdate.toLocaleString()}</small>
    {/if}
  {:else}
    <button class="btn" on:click={getAccount}>Get Account</button>
  {/if}
  {#each messages as msg}
    <div class="message-box">
      <div class="title">
        <span class="from">{msg.from.address}</span>
        <span class="subject">{msg.subject}</span>
        <span class="time">{new Date(msg.updatedAt).toLocaleString()}</span>
        {#if msg.show}
          <button on:click={() => hideContent(msg.id)}>Hide</button>
        {:else}
          <button on:click={() => showContent(msg.id)}>Show</button>
        {/if}
      </div>
      {#if msg.show}
        <div class="content">
          {msg.content?.text}
        </div>
      {/if}
    </div>
  {:else}
    {#if account}
      <p>No Message.</p>
    {/if}
  {/each}
</main>

<style>
  @font-face {
    font-family: "GmarketSansMedium";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }
  main {
    font-family: sans-serif;
    text-align: center;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .account-box {
    display: inline-block;
    flex-direction: column;
    margin: 7px;
    border: 1px solid #888;
    padding: 15px 10px 15px;
    border-radius: 5px;
    box-shadow: #555 2px 2px 7px;
    overflow: hidden;
  }

  .message-box,
  .btn {
    margin: 7px;
    padding: 0;
    border: 1px solid #888;
    border-radius: 5px;
    box-shadow: #555 2px 2px 7px;
    font-size: 12px;
  }

  .btn {
    padding: 10px;
    font-size: 16px;
    background: #0001;
  }
  .btn:hover {
    background: #0002;
  }
  .btn:active {
    background: #0003;
  }

  .message-box .title {
    display: flex;
    justify-content: stretch;
    height: 100%;
  }
  .message-box .title .from {
    min-width: 150px;
    overflow: hidden;
  }
  .message-box .title .subject {
    width: 100%;
  }
  .message-box .title .time {
    min-width: 150px;
  }
  .message-box .title > button {
    min-width: 60px;
    background: #0000;
    border: none;
  }
  .message-box .title > button:hover {
    background: #0001;
  }
  .message-box .title > button:active {
    background: #0002;
  }
  .message-box .title > * {
    padding: 8px 5px;
    display: flex;
    justify-content: center;
  }
  .message-box .title > *:not(:first-child) {
    border-left: 1px solid #888;
  }

  .message-box .content {
    border-top: 1px solid #888;
    padding: 15px;
  }

  .email .text {
    font-family: "GmarketSansMedium", monospace;
    font-size: 20px;
  }
</style>
