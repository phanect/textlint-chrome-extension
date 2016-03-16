/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import appMessage from "../../../app/scripts/lib/app/app-message";

describe("appMessage", () => {
  beforeEach(() => {
    appMessage.reset();
  });

  describe("#on()", () => {
    it("accepts known message type", () => {
      assert.doesNotThrow(() => {
        appMessage.on(appMessage.GET_STATUS, () => {});
      });
    });

    it("does not accept unknown message type", () => {
      assert.throws(() => {
        appMessage.on("UNKNOWN", () => {});
      });
    });

    it("registers event handler", () => {
      const handler = sinon.spy();
      appMessage.on(appMessage.GET_STATUS, handler);
      chrome.runtime.onMessage.trigger({ type: appMessage.GET_STATUS }, {}, () => {});
      assert(handler.calledOnce);
    });
  });

  describe("#send()", () => {
    let promise;

    function send() {
      return appMessage.send(appMessage.GET_STATUS);
    }
    function getCallback() {
      return chrome.runtime.sendMessage.firstCall.args[2];
    }

    it("returns Promise", () => {
      assert(send() instanceof Promise);
    });

    it("calls chrome.runtime.sendMessage", () => {
      send();
      assert(chrome.runtime.sendMessage.called);
    });

    it("passes a message", () => {
      send();
      const message = chrome.runtime.sendMessage.firstCall.args[0];
      assert(message.type === appMessage.GET_STATUS);
    });

    it("passes a callback for response", () => {
      send();
      assert(getCallback() instanceof Function);
    });

    context("with success response", () => {
      const response = {};

      function sendSuccess() {
        const promise = send();
        getCallback().call(null, response);
        return promise;
      }

      it("resolves a promise with response", () => {
        return withResolved(sendSuccess(), (passed) => {
          assert(response === passed);
        });
      });
    });

    context("with error response", () => {
      const error = { message: "TEST" };
      let handler;

      function sendError() {
        handler = sinon.spy();
        appMessage.onError(handler);
        const promise = send();
        chrome.runtime.lastError = error;
        getCallback().call(null, undefined);
        return promise;
      }

      it("rejects a promise with error message", () => {
        return withRejected(sendError(), (passed) => {
          assert(passed === error.message);
        });
      });

      it("calls error handler when error occurred", () => {
        return withRejected(sendError(), (passed) => {
          assert(handler.calledOnce);
        });
      });
    });
  });

  describe("#tabSend", () => {
    const tabId = 1;

    function send() {
      return appMessage.tabSend(tabId, appMessage.GET_STATUS);
    }
    function getCallback() {
      return chrome.tabs.sendMessage.firstCall.args[3];
    }

    it("returns Promise", () => {
      assert(send() instanceof Promise);
    });

    it("calls chrome.tabs.sendMessage", () => {
      send();
      assert(chrome.tabs.sendMessage.calledOnce);
    });

    it("passes tabId", () => {
      send();
      const passed = chrome.tabs.sendMessage.firstCall.args[0];
      assert(passed === tabId);
    });

    it("passes a message", () => {
      send();
      const message = chrome.tabs.sendMessage.firstCall.args[1];
      assert(message.type === appMessage.GET_STATUS);
    });

    it("passes a callback for response", () => {
      send();
      assert(getCallback() instanceof Function);
    });

    context("with success response", () => {
      const response = {};

      function sendSuccess() {
        const promise = send();
        getCallback().call(null, response);
        return promise;
      }

      it("resolves a promise with response", () => {
        return withResolved(sendSuccess(), (passed) => {
          assert(response === passed);
        });
      });
    });

    context("with error response", () => {
      const error = { message: "TEST" };
      let handler;

      function sendError() {
        handler = sinon.spy();
        appMessage.onError(handler);
        const promise = send();
        chrome.runtime.lastError = error;
        getCallback().call(null, undefined);
        return promise;
      }

      it("rejects a promise with error message", () => {
        return withRejected(sendError(), (passed) => {
          assert(passed === error.message);
        });
      });

      it("calls error handler when error occurred", () => {
        return withRejected(sendError(), (passed) => {
          assert(handler.calledOnce);
        });
      });
    });
  });
});
