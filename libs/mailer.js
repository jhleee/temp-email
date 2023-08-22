import axios from "axios";
import { genId } from "cf-gen-id";

function delay(ms) {
  return new Promise((res, rej) => {
    setTimeout(function () {
      res();
    }, ms);
  });
}

function getId() {
  return genId({ prefix: "em_x", size: 10, randomSet: "_abcdef0123456789" });
}

function getPw() {
  return genId({ prefix: "pw_x", size: 8, randomSet: "_abcdef0123456789" });
}

async function _createAccount() {
  let param = {};
  let result;
  {
    let tryCount = 2;
    while (--tryCount > 0) {
      try {
        param = {
          address: getId() + "@pretreer.com",
          password: getPw()
        };
        let { data } = await axios.post("https://api.mail.tm/accounts", param);
        result = data;
        param.id = result.id;
        result.password = param.password;
        break;
      } catch (error) {
        console.log("Get Account retry ...");
        continue;
      }
    }
    if (tryCount === 0) {
      return {};
    }
    tryCount = 5;
    while (tryCount-- > 0) {
      try {
        let { data } = await axios.post("https://api.mail.tm/token", {
          address: param.address,
          password: param.password
        });
        result.token = data.token;
        break;
      } catch (error) {
        result.token = "Fail";
        console.log("Get Token retry ...");
        await delay(3000);
        continue;
      }
    }
  }

  return result;
}

export async function createAccount() {
  return await _createAccount();
}

export async function getMessages(token) {
  let { data } = await axios.get("https://api.mail.tm/messages", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data["hydra:member"];
}

export async function getMessage(id, token) {
  let { data } = await axios.get("https://api.mail.tm/messages/" + id, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}
