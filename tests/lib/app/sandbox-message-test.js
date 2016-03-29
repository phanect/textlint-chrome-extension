/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import sandboxMessage from "../../../app/scripts/lib/app/sandbox-message";

describe("sandboxMessage", () => {
  const messageType = sandboxMessage.ACTIVATE;
  const returnMessageType = sandboxMessage.RETURN_ACTIVATE;
  const message = { foo: "bar" };
  const typedMessage = { type: sandboxMessage.ACTIVATE, foo: "bar" };

  beforeEach(() => {
    sandboxMessage.reset();
  });

  describe("#on()", () => {
    it("accepts known message type", () => {
      assert.doesNotThrow(() => {
        sandboxMessage.on(messageType, () => {});
      });
    });

    it("does not accept unknown message type", () => {
      assert.throws(() => {
        sandboxMessage.on("UNKNOWN", () => {});
      });
    });

    it("registers event handler", (done) => {
      const handler = (received) => {
        assert.deepEqual(received, typedMessage);
        done();
      };
      sandboxMessage.on(messageType, handler);
      window.postMessage(typedMessage, "*");
    });

    it("posts response back", (done) => {
      sandboxMessage.on(returnMessageType, (response) => {
        assert(response.test === 123);
        done();
      });
      const handler = (received, sendResponse) => {
        sendResponse({ test: 123 });
      };
      sandboxMessage.on(messageType, handler);
      window.postMessage(typedMessage, "*");
    });
  });

  describe("#send()", () => {
    const sandboxWindow = document.getElementById("sandbox").contentWindow;
    let messageListener;

    afterEach(() => {
      if (messageListener) {
        sandboxWindow.removeEventListener("message", messageListener, false);
      }
    });

    function send() {
      return new Promise((resolve) => {
        messageListener = (event) => { resolve(event.data); };
        sandboxWindow.addEventListener("message", messageListener, false);
        sandboxMessage.send(messageType, message);
      });
    }

    it("posts message to sandbox iframe", () => {
      return withResolved(send(), (posted) => {
        assert.deepEqual(posted, typedMessage);
      });
    });
  });
});
