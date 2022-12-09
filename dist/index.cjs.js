'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var injectedConnector = require('@web3-react/injected-connector');
var walletconnectConnector = require('@web3-react/walletconnect-connector');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var ethers = require('ethers');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var React = require('react');
var core = require('@web3-react/core');
var buffer = require('buffer');
var reactDom = require('react-dom');
var react = require('@prismicio/react');
var prismic = require('@prismicio/client');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);
var prismic__namespace = /*#__PURE__*/_interopNamespaceDefault(prismic);

var getCurrentAmbNetwork = function getCurrentAmbNetwork() {
  var chainId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.env.REACT_APP_CHAIN_ID || 16718;
  return allAmbNetworksConfig[chainId];
};
var allAmbNetworksConfig = {
  30746: {
    name: 'Ambrosus Devnet',
    chainId: 30746,
    code: 'AMB',
    tokenSymbol: 'AMB',
    tokenDenomination: 18,
    explorerUrl: 'https://explorer.ambrosus-dev.io/',
    rpcUrl: 'https://network.ambrosus-dev.io',
    rpcUrlWS: 'wss://network.ambrosus-dev.io/ws'
  },
  22040: {
    name: 'Ambrosus Testnet',
    chainId: 22040,
    code: 'AMB',
    tokenSymbol: 'AMB',
    tokenDenomination: 18,
    explorerUrl: 'https://explorer.ambrosus-test.io/',
    rpcUrl: 'https://network.ambrosus-test.io',
    rpcUrlWS: 'wss://network.ambrosus-test.io/ws'
  },
  16718: {
    name: 'Ambrosus Mainnet',
    chainId: 16718,
    code: 'AMB',
    tokenSymbol: 'AMB',
    tokenDenomination: 18,
    explorerUrl: 'https://airdao.io/explorer/',
    rpcUrl: 'https://network.ambrosus.io/',
    rpcUrlWS: 'wss://network.ambrosus.io/ws'
  }
};

var ambNetwork = getCurrentAmbNetwork();
var defaultInjectedConnector = new injectedConnector.InjectedConnector({
  supportedChainIds: [+ambNetwork.chainId]
});
var defaultWalletConnectConnector = new walletconnectConnector.WalletConnectConnector({
  rpc: _defineProperty({}, +ambNetwork.chainId, ambNetwork.rpcUrl),
  chainId: ambNetwork.chainId,
  bridge: 'https://bridge.walletconnect.org',
  pollingInterval: 6000,
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'trustee']
  }
});

var changeChainId = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(provider, selectedNetwork) {
    var hexChainId;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hexChainId = ethers.utils.hexValue(+selectedNetwork);
            _context.prev = 1;
            _context.next = 4;
            return provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{
                chainId: hexChainId
              }]
            });
          case 4:
            _context.next = 10;
            break;
          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            _context.next = 10;
            return provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: hexChainId,
                chainName: selectedNetwork.name,
                nativeCurrency: {
                  name: selectedNetwork.tokenSymbol,
                  symbol: selectedNetwork.tokenSymbol,
                  decimals: selectedNetwork.tokenDenomination
                },
                rpcUrls: [selectedNetwork.rpcUrl],
                blockExplorerUrls: [selectedNetwork.explorerUrl]
              }]
            });
          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 6]]);
  }));
  return function changeChainId(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var useAuthorization = function useAuthorization(web3ReactInstance) {
  var configuredInjectedConnector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultInjectedConnector;
  var configuredWalletConnectConnector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultWalletConnectConnector;
  var activate = web3ReactInstance.activate,
    deactivate = web3ReactInstance.deactivate;
  var loginMetamask = function loginMetamask() {
    var _window = window,
      ethereum = _window.ethereum;
    if (ethereum && ethereum.isMetaMask) {
      activate(configuredInjectedConnector).then(function () {
        localStorage.setItem('wallet', 'metamask');
      });
    } else {
      window.open("https://metamask.app.link/dapp/".concat(window.location.hostname + window.location.pathname)).focus();
    }
  };
  var loginWalletConnect = function loginWalletConnect() {
    activate(configuredWalletConnectConnector).then(function () {
      localStorage.setItem('wallet', 'walletconnect');
    });
  };
  var logout = function logout() {
    localStorage.removeItem('wallet');
    deactivate();
  };
  return {
    loginMetamask: loginMetamask,
    loginWalletConnect: loginWalletConnect,
    logout: logout
  };
};

var useAutoLogin = function useAutoLogin(web3ReactInstance) {
  var configuredInjectedConnector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultInjectedConnector;
  var activate = web3ReactInstance.activate,
    error = web3ReactInstance.error,
    connector = web3ReactInstance.connector;
  var _useState = React.useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isLoaded = _useState2[0],
    setIsLoaded = _useState2[1];
  React.useEffect(function () {
    _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _window, ethereum, isUnlocked, lastAuthorizedWallet;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _window = window, ethereum = _window.ethereum; // eslint-disable-next-line no-underscore-dangle
              _context.next = 3;
              return ethereum && ethereum._metamask && ethereum._metamask.isUnlocked();
            case 3:
              isUnlocked = _context.sent;
              lastAuthorizedWallet = localStorage.getItem('wallet');
              if (lastAuthorizedWallet === 'metamask' && isUnlocked) {
                activate(configuredInjectedConnector).then(function () {
                  return setIsLoaded(true);
                });
              } else {
                setIsLoaded(true);
              }
            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, []);
  React.useEffect(function () {
    if (error instanceof core.UnsupportedChainIdError) {
      if (connector instanceof injectedConnector.InjectedConnector && !document.hidden) {
        var ambNetwork = getCurrentAmbNetwork();
        changeChainId(window.ethereum, ambNetwork);
      }
    }
  }, [error]);
  return isLoaded;
};

window.Buffer = window.Buffer || buffer.Buffer;

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$2 = ".wallet-modal {\n  display: flex;\n  flex-flow: row nowrap;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100vh;\n  width: 100vw;\n}\n\n.wallet-modal__overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  z-index: 1000;\n  background: linear-gradient(135deg, rgba(225, 235, 255, 0.67) 0%, rgba(203, 213, 233, 0.27) 100%);\n  backdrop-filter: blur(7px);\n}\n\n.wallet-modal__container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 24px;\n  width: 412px;\n  height: auto;\n  background: #FFFFFF;\n  box-shadow: 0 8px 49px rgba(162, 178, 216, 0.65);\n  border-radius: 16px;\n  z-index: 1001;\n}\n@media screen and (max-width: 500px) {\n  .wallet-modal__container {\n    width: calc(100% - 2rem);\n    margin: 0 1rem;\n    padding: 24px 16px;\n  }\n}\n\n.wallet-modal__text {\n  font-family: \"Inter\", sans-serif;\n  font-style: normal;\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 24px;\n  text-align: center;\n  color: #1D1D1D;\n  padding: 0;\n  margin: 0 0 24px;\n}\n@media screen and (max-width: 500px) {\n  .wallet-modal__text {\n    font-size: 14px;\n  }\n}";
styleInject(css_248z$2);

var css_248z$1 = ".modal-button {\n  width: 100%;\n  height: 5rem;\n  margin-bottom: 8px;\n  padding: 16px;\n  background: #ffffff;\n  display: flex;\n  flex-flow: row nowrap;\n  align-items: center;\n  grid-column-gap: 12px;\n  border-radius: 16px;\n  border-color: transparent;\n  box-shadow: 0 16px 32px rgba(105, 142, 226, 0.2);\n  cursor: pointer;\n}\n@media screen and (max-width: 500px) {\n  .modal-button {\n    width: 100%;\n    padding: 16px 8px;\n  }\n}\n\n.modal-button__logo {\n  height: 48px;\n  width: 48px;\n  background: white;\n  border-radius: 50%;\n  overflow: hidden;\n}\n\n.modal-button__text-container {\n  text-align: left;\n}\n\n.modal-button__heading {\n  font-family: \"Proxima Nova\", sans-serif;\n  font-style: normal;\n  font-weight: 600;\n  font-size: 14px;\n  line-height: 100%;\n  color: #212121;\n  margin-bottom: 14px;\n}\n@media screen and (max-width: 481px) {\n  .modal-button__heading {\n    font-size: 14px !important;\n  }\n}\n\n.modal-button__text {\n  font-family: \"Proxima Nova\", sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  font-size: 14px;\n  color: #a2b2d8;\n}\n\n.modal-button__chevron {\n  width: 16px;\n  height: 16px;\n  transform: rotate(-90deg);\n  margin-left: auto;\n}";
styleInject(css_248z$1);

var _path$2;
function _extends$2() { _extends$2 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var SvgChevron = function SvgChevron(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$2({
    width: 16,
    height: 16,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m4 6 4 4 4-4",
    stroke: "#808A9D",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
};

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var objectAssign;
var hasRequiredObjectAssign;

function requireObjectAssign () {
	if (hasRequiredObjectAssign) return objectAssign;
	hasRequiredObjectAssign = 1;
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};
	return objectAssign;
}

/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;

function requireReactJsxRuntime_production_min () {
	if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
	hasRequiredReactJsxRuntime_production_min = 1;
requireObjectAssign();var f=React,g=60103;reactJsxRuntime_production_min.Fragment=60107;if("function"===typeof Symbol&&Symbol.for){var h=Symbol.for;g=h("react.element");reactJsxRuntime_production_min.Fragment=h("react.fragment");}var m=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n=Object.prototype.hasOwnProperty,p={key:!0,ref:!0,__self:!0,__source:!0};
	function q(c,a,k){var b,d={},e=null,l=null;void 0!==k&&(e=""+k);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(l=a.ref);for(b in a)n.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:g,type:c,key:e,ref:l,props:d,_owner:m.current}}reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;
	return reactJsxRuntime_production_min;
}

var reactJsxRuntime_development = {};

/** @license React v17.0.2
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_development;

function requireReactJsxRuntime_development () {
	if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
	hasRequiredReactJsxRuntime_development = 1;
	(function (exports) {

		if (process.env.NODE_ENV !== "production") {
		  (function() {

		var React$1 = React;
		var _assign = requireObjectAssign();

		// ATTENTION
		// When adding new symbols to this file,
		// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
		// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
		// nor polyfill, then a plain number is used for performance.
		var REACT_ELEMENT_TYPE = 0xeac7;
		var REACT_PORTAL_TYPE = 0xeaca;
		exports.Fragment = 0xeacb;
		var REACT_STRICT_MODE_TYPE = 0xeacc;
		var REACT_PROFILER_TYPE = 0xead2;
		var REACT_PROVIDER_TYPE = 0xeacd;
		var REACT_CONTEXT_TYPE = 0xeace;
		var REACT_FORWARD_REF_TYPE = 0xead0;
		var REACT_SUSPENSE_TYPE = 0xead1;
		var REACT_SUSPENSE_LIST_TYPE = 0xead8;
		var REACT_MEMO_TYPE = 0xead3;
		var REACT_LAZY_TYPE = 0xead4;
		var REACT_BLOCK_TYPE = 0xead9;
		var REACT_SERVER_BLOCK_TYPE = 0xeada;
		var REACT_FUNDAMENTAL_TYPE = 0xead5;
		var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
		var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

		if (typeof Symbol === 'function' && Symbol.for) {
		  var symbolFor = Symbol.for;
		  REACT_ELEMENT_TYPE = symbolFor('react.element');
		  REACT_PORTAL_TYPE = symbolFor('react.portal');
		  exports.Fragment = symbolFor('react.fragment');
		  REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
		  REACT_PROFILER_TYPE = symbolFor('react.profiler');
		  REACT_PROVIDER_TYPE = symbolFor('react.provider');
		  REACT_CONTEXT_TYPE = symbolFor('react.context');
		  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
		  REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
		  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
		  REACT_MEMO_TYPE = symbolFor('react.memo');
		  REACT_LAZY_TYPE = symbolFor('react.lazy');
		  REACT_BLOCK_TYPE = symbolFor('react.block');
		  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
		  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
		  symbolFor('react.scope');
		  symbolFor('react.opaque.id');
		  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
		  symbolFor('react.offscreen');
		  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
		}

		var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
		var FAUX_ITERATOR_SYMBOL = '@@iterator';
		function getIteratorFn(maybeIterable) {
		  if (maybeIterable === null || typeof maybeIterable !== 'object') {
		    return null;
		  }

		  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

		  if (typeof maybeIterator === 'function') {
		    return maybeIterator;
		  }

		  return null;
		}

		var ReactSharedInternals = React$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

		function error(format) {
		  {
		    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		      args[_key2 - 1] = arguments[_key2];
		    }

		    printWarning('error', format, args);
		  }
		}

		function printWarning(level, format, args) {
		  // When changing this logic, you might want to also
		  // update consoleWithStackDev.www.js as well.
		  {
		    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
		    var stack = ReactDebugCurrentFrame.getStackAddendum();

		    if (stack !== '') {
		      format += '%s';
		      args = args.concat([stack]);
		    }

		    var argsWithFormat = args.map(function (item) {
		      return '' + item;
		    }); // Careful: RN currently depends on this prefix

		    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
		    // breaks IE9: https://github.com/facebook/react/issues/13610
		    // eslint-disable-next-line react-internal/no-production-logging

		    Function.prototype.apply.call(console[level], console, argsWithFormat);
		  }
		}

		// Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

		var enableScopeAPI = false; // Experimental Create Event Handle API.

		function isValidElementType(type) {
		  if (typeof type === 'string' || typeof type === 'function') {
		    return true;
		  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


		  if (type === exports.Fragment || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
		    return true;
		  }

		  if (typeof type === 'object' && type !== null) {
		    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
		      return true;
		    }
		  }

		  return false;
		}

		function getWrappedName(outerType, innerType, wrapperName) {
		  var functionName = innerType.displayName || innerType.name || '';
		  return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
		}

		function getContextName(type) {
		  return type.displayName || 'Context';
		}

		function getComponentName(type) {
		  if (type == null) {
		    // Host root, text node or just invalid type.
		    return null;
		  }

		  {
		    if (typeof type.tag === 'number') {
		      error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
		    }
		  }

		  if (typeof type === 'function') {
		    return type.displayName || type.name || null;
		  }

		  if (typeof type === 'string') {
		    return type;
		  }

		  switch (type) {
		    case exports.Fragment:
		      return 'Fragment';

		    case REACT_PORTAL_TYPE:
		      return 'Portal';

		    case REACT_PROFILER_TYPE:
		      return 'Profiler';

		    case REACT_STRICT_MODE_TYPE:
		      return 'StrictMode';

		    case REACT_SUSPENSE_TYPE:
		      return 'Suspense';

		    case REACT_SUSPENSE_LIST_TYPE:
		      return 'SuspenseList';
		  }

		  if (typeof type === 'object') {
		    switch (type.$$typeof) {
		      case REACT_CONTEXT_TYPE:
		        var context = type;
		        return getContextName(context) + '.Consumer';

		      case REACT_PROVIDER_TYPE:
		        var provider = type;
		        return getContextName(provider._context) + '.Provider';

		      case REACT_FORWARD_REF_TYPE:
		        return getWrappedName(type, type.render, 'ForwardRef');

		      case REACT_MEMO_TYPE:
		        return getComponentName(type.type);

		      case REACT_BLOCK_TYPE:
		        return getComponentName(type._render);

		      case REACT_LAZY_TYPE:
		        {
		          var lazyComponent = type;
		          var payload = lazyComponent._payload;
		          var init = lazyComponent._init;

		          try {
		            return getComponentName(init(payload));
		          } catch (x) {
		            return null;
		          }
		        }
		    }
		  }

		  return null;
		}

		// Helpers to patch console.logs to avoid logging during side-effect free
		// replaying on render function. This currently only patches the object
		// lazily which won't cover if the log function was extracted eagerly.
		// We could also eagerly patch the method.
		var disabledDepth = 0;
		var prevLog;
		var prevInfo;
		var prevWarn;
		var prevError;
		var prevGroup;
		var prevGroupCollapsed;
		var prevGroupEnd;

		function disabledLog() {}

		disabledLog.__reactDisabledLog = true;
		function disableLogs() {
		  {
		    if (disabledDepth === 0) {
		      /* eslint-disable react-internal/no-production-logging */
		      prevLog = console.log;
		      prevInfo = console.info;
		      prevWarn = console.warn;
		      prevError = console.error;
		      prevGroup = console.group;
		      prevGroupCollapsed = console.groupCollapsed;
		      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

		      var props = {
		        configurable: true,
		        enumerable: true,
		        value: disabledLog,
		        writable: true
		      }; // $FlowFixMe Flow thinks console is immutable.

		      Object.defineProperties(console, {
		        info: props,
		        log: props,
		        warn: props,
		        error: props,
		        group: props,
		        groupCollapsed: props,
		        groupEnd: props
		      });
		      /* eslint-enable react-internal/no-production-logging */
		    }

		    disabledDepth++;
		  }
		}
		function reenableLogs() {
		  {
		    disabledDepth--;

		    if (disabledDepth === 0) {
		      /* eslint-disable react-internal/no-production-logging */
		      var props = {
		        configurable: true,
		        enumerable: true,
		        writable: true
		      }; // $FlowFixMe Flow thinks console is immutable.

		      Object.defineProperties(console, {
		        log: _assign({}, props, {
		          value: prevLog
		        }),
		        info: _assign({}, props, {
		          value: prevInfo
		        }),
		        warn: _assign({}, props, {
		          value: prevWarn
		        }),
		        error: _assign({}, props, {
		          value: prevError
		        }),
		        group: _assign({}, props, {
		          value: prevGroup
		        }),
		        groupCollapsed: _assign({}, props, {
		          value: prevGroupCollapsed
		        }),
		        groupEnd: _assign({}, props, {
		          value: prevGroupEnd
		        })
		      });
		      /* eslint-enable react-internal/no-production-logging */
		    }

		    if (disabledDepth < 0) {
		      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
		    }
		  }
		}

		var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
		var prefix;
		function describeBuiltInComponentFrame(name, source, ownerFn) {
		  {
		    if (prefix === undefined) {
		      // Extract the VM specific prefix used by each line.
		      try {
		        throw Error();
		      } catch (x) {
		        var match = x.stack.trim().match(/\n( *(at )?)/);
		        prefix = match && match[1] || '';
		      }
		    } // We use the prefix to ensure our stacks line up with native stack frames.


		    return '\n' + prefix + name;
		  }
		}
		var reentry = false;
		var componentFrameCache;

		{
		  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
		  componentFrameCache = new PossiblyWeakMap();
		}

		function describeNativeComponentFrame(fn, construct) {
		  // If something asked for a stack inside a fake render, it should get ignored.
		  if (!fn || reentry) {
		    return '';
		  }

		  {
		    var frame = componentFrameCache.get(fn);

		    if (frame !== undefined) {
		      return frame;
		    }
		  }

		  var control;
		  reentry = true;
		  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

		  Error.prepareStackTrace = undefined;
		  var previousDispatcher;

		  {
		    previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
		    // for warnings.

		    ReactCurrentDispatcher.current = null;
		    disableLogs();
		  }

		  try {
		    // This should throw.
		    if (construct) {
		      // Something should be setting the props in the constructor.
		      var Fake = function () {
		        throw Error();
		      }; // $FlowFixMe


		      Object.defineProperty(Fake.prototype, 'props', {
		        set: function () {
		          // We use a throwing setter instead of frozen or non-writable props
		          // because that won't throw in a non-strict mode function.
		          throw Error();
		        }
		      });

		      if (typeof Reflect === 'object' && Reflect.construct) {
		        // We construct a different control for this case to include any extra
		        // frames added by the construct call.
		        try {
		          Reflect.construct(Fake, []);
		        } catch (x) {
		          control = x;
		        }

		        Reflect.construct(fn, [], Fake);
		      } else {
		        try {
		          Fake.call();
		        } catch (x) {
		          control = x;
		        }

		        fn.call(Fake.prototype);
		      }
		    } else {
		      try {
		        throw Error();
		      } catch (x) {
		        control = x;
		      }

		      fn();
		    }
		  } catch (sample) {
		    // This is inlined manually because closure doesn't do it for us.
		    if (sample && control && typeof sample.stack === 'string') {
		      // This extracts the first frame from the sample that isn't also in the control.
		      // Skipping one frame that we assume is the frame that calls the two.
		      var sampleLines = sample.stack.split('\n');
		      var controlLines = control.stack.split('\n');
		      var s = sampleLines.length - 1;
		      var c = controlLines.length - 1;

		      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
		        // We expect at least one stack frame to be shared.
		        // Typically this will be the root most one. However, stack frames may be
		        // cut off due to maximum stack limits. In this case, one maybe cut off
		        // earlier than the other. We assume that the sample is longer or the same
		        // and there for cut off earlier. So we should find the root most frame in
		        // the sample somewhere in the control.
		        c--;
		      }

		      for (; s >= 1 && c >= 0; s--, c--) {
		        // Next we find the first one that isn't the same which should be the
		        // frame that called our sample function and the control.
		        if (sampleLines[s] !== controlLines[c]) {
		          // In V8, the first line is describing the message but other VMs don't.
		          // If we're about to return the first line, and the control is also on the same
		          // line, that's a pretty good indicator that our sample threw at same line as
		          // the control. I.e. before we entered the sample frame. So we ignore this result.
		          // This can happen if you passed a class to function component, or non-function.
		          if (s !== 1 || c !== 1) {
		            do {
		              s--;
		              c--; // We may still have similar intermediate frames from the construct call.
		              // The next one that isn't the same should be our match though.

		              if (c < 0 || sampleLines[s] !== controlLines[c]) {
		                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
		                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at ');

		                {
		                  if (typeof fn === 'function') {
		                    componentFrameCache.set(fn, _frame);
		                  }
		                } // Return the line we found.


		                return _frame;
		              }
		            } while (s >= 1 && c >= 0);
		          }

		          break;
		        }
		      }
		    }
		  } finally {
		    reentry = false;

		    {
		      ReactCurrentDispatcher.current = previousDispatcher;
		      reenableLogs();
		    }

		    Error.prepareStackTrace = previousPrepareStackTrace;
		  } // Fallback to just using the name if we couldn't make it throw.


		  var name = fn ? fn.displayName || fn.name : '';
		  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

		  {
		    if (typeof fn === 'function') {
		      componentFrameCache.set(fn, syntheticFrame);
		    }
		  }

		  return syntheticFrame;
		}
		function describeFunctionComponentFrame(fn, source, ownerFn) {
		  {
		    return describeNativeComponentFrame(fn, false);
		  }
		}

		function shouldConstruct(Component) {
		  var prototype = Component.prototype;
		  return !!(prototype && prototype.isReactComponent);
		}

		function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

		  if (type == null) {
		    return '';
		  }

		  if (typeof type === 'function') {
		    {
		      return describeNativeComponentFrame(type, shouldConstruct(type));
		    }
		  }

		  if (typeof type === 'string') {
		    return describeBuiltInComponentFrame(type);
		  }

		  switch (type) {
		    case REACT_SUSPENSE_TYPE:
		      return describeBuiltInComponentFrame('Suspense');

		    case REACT_SUSPENSE_LIST_TYPE:
		      return describeBuiltInComponentFrame('SuspenseList');
		  }

		  if (typeof type === 'object') {
		    switch (type.$$typeof) {
		      case REACT_FORWARD_REF_TYPE:
		        return describeFunctionComponentFrame(type.render);

		      case REACT_MEMO_TYPE:
		        // Memo may contain any component type so we recursively resolve it.
		        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

		      case REACT_BLOCK_TYPE:
		        return describeFunctionComponentFrame(type._render);

		      case REACT_LAZY_TYPE:
		        {
		          var lazyComponent = type;
		          var payload = lazyComponent._payload;
		          var init = lazyComponent._init;

		          try {
		            // Lazy may contain any component type so we recursively resolve it.
		            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
		          } catch (x) {}
		        }
		    }
		  }

		  return '';
		}

		var loggedTypeFailures = {};
		var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

		function setCurrentlyValidatingElement(element) {
		  {
		    if (element) {
		      var owner = element._owner;
		      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
		      ReactDebugCurrentFrame.setExtraStackFrame(stack);
		    } else {
		      ReactDebugCurrentFrame.setExtraStackFrame(null);
		    }
		  }
		}

		function checkPropTypes(typeSpecs, values, location, componentName, element) {
		  {
		    // $FlowFixMe This is okay but Flow doesn't know it.
		    var has = Function.call.bind(Object.prototype.hasOwnProperty);

		    for (var typeSpecName in typeSpecs) {
		      if (has(typeSpecs, typeSpecName)) {
		        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
		        // fail the render phase where it didn't fail before. So we log it.
		        // After these have been cleaned up, we'll let them throw.

		        try {
		          // This is intentionally an invariant that gets caught. It's the same
		          // behavior as without this statement except with a better message.
		          if (typeof typeSpecs[typeSpecName] !== 'function') {
		            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
		            err.name = 'Invariant Violation';
		            throw err;
		          }

		          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
		        } catch (ex) {
		          error$1 = ex;
		        }

		        if (error$1 && !(error$1 instanceof Error)) {
		          setCurrentlyValidatingElement(element);

		          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

		          setCurrentlyValidatingElement(null);
		        }

		        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
		          // Only monitor this failure once because there tends to be a lot of the
		          // same error.
		          loggedTypeFailures[error$1.message] = true;
		          setCurrentlyValidatingElement(element);

		          error('Failed %s type: %s', location, error$1.message);

		          setCurrentlyValidatingElement(null);
		        }
		      }
		    }
		  }
		}

		var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var RESERVED_PROPS = {
		  key: true,
		  ref: true,
		  __self: true,
		  __source: true
		};
		var specialPropKeyWarningShown;
		var specialPropRefWarningShown;
		var didWarnAboutStringRefs;

		{
		  didWarnAboutStringRefs = {};
		}

		function hasValidRef(config) {
		  {
		    if (hasOwnProperty.call(config, 'ref')) {
		      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

		      if (getter && getter.isReactWarning) {
		        return false;
		      }
		    }
		  }

		  return config.ref !== undefined;
		}

		function hasValidKey(config) {
		  {
		    if (hasOwnProperty.call(config, 'key')) {
		      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

		      if (getter && getter.isReactWarning) {
		        return false;
		      }
		    }
		  }

		  return config.key !== undefined;
		}

		function warnIfStringRefCannotBeAutoConverted(config, self) {
		  {
		    if (typeof config.ref === 'string' && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
		      var componentName = getComponentName(ReactCurrentOwner.current.type);

		      if (!didWarnAboutStringRefs[componentName]) {
		        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', getComponentName(ReactCurrentOwner.current.type), config.ref);

		        didWarnAboutStringRefs[componentName] = true;
		      }
		    }
		  }
		}

		function defineKeyPropWarningGetter(props, displayName) {
		  {
		    var warnAboutAccessingKey = function () {
		      if (!specialPropKeyWarningShown) {
		        specialPropKeyWarningShown = true;

		        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
		      }
		    };

		    warnAboutAccessingKey.isReactWarning = true;
		    Object.defineProperty(props, 'key', {
		      get: warnAboutAccessingKey,
		      configurable: true
		    });
		  }
		}

		function defineRefPropWarningGetter(props, displayName) {
		  {
		    var warnAboutAccessingRef = function () {
		      if (!specialPropRefWarningShown) {
		        specialPropRefWarningShown = true;

		        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
		      }
		    };

		    warnAboutAccessingRef.isReactWarning = true;
		    Object.defineProperty(props, 'ref', {
		      get: warnAboutAccessingRef,
		      configurable: true
		    });
		  }
		}
		/**
		 * Factory method to create a new React element. This no longer adheres to
		 * the class pattern, so do not use new to call it. Also, instanceof check
		 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
		 * if something is a React Element.
		 *
		 * @param {*} type
		 * @param {*} props
		 * @param {*} key
		 * @param {string|object} ref
		 * @param {*} owner
		 * @param {*} self A *temporary* helper to detect places where `this` is
		 * different from the `owner` when React.createElement is called, so that we
		 * can warn. We want to get rid of owner and replace string `ref`s with arrow
		 * functions, and as long as `this` and owner are the same, there will be no
		 * change in behavior.
		 * @param {*} source An annotation object (added by a transpiler or otherwise)
		 * indicating filename, line number, and/or other information.
		 * @internal
		 */


		var ReactElement = function (type, key, ref, self, source, owner, props) {
		  var element = {
		    // This tag allows us to uniquely identify this as a React Element
		    $$typeof: REACT_ELEMENT_TYPE,
		    // Built-in properties that belong on the element
		    type: type,
		    key: key,
		    ref: ref,
		    props: props,
		    // Record the component responsible for creating this element.
		    _owner: owner
		  };

		  {
		    // The validation flag is currently mutative. We put it on
		    // an external backing store so that we can freeze the whole object.
		    // This can be replaced with a WeakMap once they are implemented in
		    // commonly used development environments.
		    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
		    // the validation flag non-enumerable (where possible, which should
		    // include every environment we run tests in), so the test framework
		    // ignores it.

		    Object.defineProperty(element._store, 'validated', {
		      configurable: false,
		      enumerable: false,
		      writable: true,
		      value: false
		    }); // self and source are DEV only properties.

		    Object.defineProperty(element, '_self', {
		      configurable: false,
		      enumerable: false,
		      writable: false,
		      value: self
		    }); // Two elements created in two different places should be considered
		    // equal for testing purposes and therefore we hide it from enumeration.

		    Object.defineProperty(element, '_source', {
		      configurable: false,
		      enumerable: false,
		      writable: false,
		      value: source
		    });

		    if (Object.freeze) {
		      Object.freeze(element.props);
		      Object.freeze(element);
		    }
		  }

		  return element;
		};
		/**
		 * https://github.com/reactjs/rfcs/pull/107
		 * @param {*} type
		 * @param {object} props
		 * @param {string} key
		 */

		function jsxDEV(type, config, maybeKey, source, self) {
		  {
		    var propName; // Reserved names are extracted

		    var props = {};
		    var key = null;
		    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
		    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
		    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
		    // but as an intermediary step, we will use jsxDEV for everything except
		    // <div {...props} key="Hi" />, because we aren't currently able to tell if
		    // key is explicitly declared to be undefined or not.

		    if (maybeKey !== undefined) {
		      key = '' + maybeKey;
		    }

		    if (hasValidKey(config)) {
		      key = '' + config.key;
		    }

		    if (hasValidRef(config)) {
		      ref = config.ref;
		      warnIfStringRefCannotBeAutoConverted(config, self);
		    } // Remaining properties are added to a new props object


		    for (propName in config) {
		      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
		        props[propName] = config[propName];
		      }
		    } // Resolve default props


		    if (type && type.defaultProps) {
		      var defaultProps = type.defaultProps;

		      for (propName in defaultProps) {
		        if (props[propName] === undefined) {
		          props[propName] = defaultProps[propName];
		        }
		      }
		    }

		    if (key || ref) {
		      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

		      if (key) {
		        defineKeyPropWarningGetter(props, displayName);
		      }

		      if (ref) {
		        defineRefPropWarningGetter(props, displayName);
		      }
		    }

		    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
		  }
		}

		var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
		var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

		function setCurrentlyValidatingElement$1(element) {
		  {
		    if (element) {
		      var owner = element._owner;
		      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
		      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
		    } else {
		      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
		    }
		  }
		}

		var propTypesMisspellWarningShown;

		{
		  propTypesMisspellWarningShown = false;
		}
		/**
		 * Verifies the object is a ReactElement.
		 * See https://reactjs.org/docs/react-api.html#isvalidelement
		 * @param {?object} object
		 * @return {boolean} True if `object` is a ReactElement.
		 * @final
		 */

		function isValidElement(object) {
		  {
		    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
		  }
		}

		function getDeclarationErrorAddendum() {
		  {
		    if (ReactCurrentOwner$1.current) {
		      var name = getComponentName(ReactCurrentOwner$1.current.type);

		      if (name) {
		        return '\n\nCheck the render method of `' + name + '`.';
		      }
		    }

		    return '';
		  }
		}

		function getSourceInfoErrorAddendum(source) {
		  {
		    if (source !== undefined) {
		      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
		      var lineNumber = source.lineNumber;
		      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
		    }

		    return '';
		  }
		}
		/**
		 * Warn if there's no key explicitly set on dynamic arrays of children or
		 * object keys are not valid. This allows us to keep track of children between
		 * updates.
		 */


		var ownerHasKeyUseWarning = {};

		function getCurrentComponentErrorInfo(parentType) {
		  {
		    var info = getDeclarationErrorAddendum();

		    if (!info) {
		      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

		      if (parentName) {
		        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
		      }
		    }

		    return info;
		  }
		}
		/**
		 * Warn if the element doesn't have an explicit key assigned to it.
		 * This element is in an array. The array could grow and shrink or be
		 * reordered. All children that haven't already been validated are required to
		 * have a "key" property assigned to it. Error statuses are cached so a warning
		 * will only be shown once.
		 *
		 * @internal
		 * @param {ReactElement} element Element that requires a key.
		 * @param {*} parentType element's parent's type.
		 */


		function validateExplicitKey(element, parentType) {
		  {
		    if (!element._store || element._store.validated || element.key != null) {
		      return;
		    }

		    element._store.validated = true;
		    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

		    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
		      return;
		    }

		    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
		    // property, it may be the creator of the child that's responsible for
		    // assigning it a key.

		    var childOwner = '';

		    if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
		      // Give the component that originally created this child.
		      childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
		    }

		    setCurrentlyValidatingElement$1(element);

		    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

		    setCurrentlyValidatingElement$1(null);
		  }
		}
		/**
		 * Ensure that every element either is passed in a static location, in an
		 * array with an explicit keys property defined, or in an object literal
		 * with valid key property.
		 *
		 * @internal
		 * @param {ReactNode} node Statically passed child of any type.
		 * @param {*} parentType node's parent's type.
		 */


		function validateChildKeys(node, parentType) {
		  {
		    if (typeof node !== 'object') {
		      return;
		    }

		    if (Array.isArray(node)) {
		      for (var i = 0; i < node.length; i++) {
		        var child = node[i];

		        if (isValidElement(child)) {
		          validateExplicitKey(child, parentType);
		        }
		      }
		    } else if (isValidElement(node)) {
		      // This element was passed in a valid location.
		      if (node._store) {
		        node._store.validated = true;
		      }
		    } else if (node) {
		      var iteratorFn = getIteratorFn(node);

		      if (typeof iteratorFn === 'function') {
		        // Entry iterators used to provide implicit keys,
		        // but now we print a separate warning for them later.
		        if (iteratorFn !== node.entries) {
		          var iterator = iteratorFn.call(node);
		          var step;

		          while (!(step = iterator.next()).done) {
		            if (isValidElement(step.value)) {
		              validateExplicitKey(step.value, parentType);
		            }
		          }
		        }
		      }
		    }
		  }
		}
		/**
		 * Given an element, validate that its props follow the propTypes definition,
		 * provided by the type.
		 *
		 * @param {ReactElement} element
		 */


		function validatePropTypes(element) {
		  {
		    var type = element.type;

		    if (type === null || type === undefined || typeof type === 'string') {
		      return;
		    }

		    var propTypes;

		    if (typeof type === 'function') {
		      propTypes = type.propTypes;
		    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
		    // Inner props are checked in the reconciler.
		    type.$$typeof === REACT_MEMO_TYPE)) {
		      propTypes = type.propTypes;
		    } else {
		      return;
		    }

		    if (propTypes) {
		      // Intentionally inside to avoid triggering lazy initializers:
		      var name = getComponentName(type);
		      checkPropTypes(propTypes, element.props, 'prop', name, element);
		    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
		      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

		      var _name = getComponentName(type);

		      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
		    }

		    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
		      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
		    }
		  }
		}
		/**
		 * Given a fragment, validate that it can only be provided with fragment props
		 * @param {ReactElement} fragment
		 */


		function validateFragmentProps(fragment) {
		  {
		    var keys = Object.keys(fragment.props);

		    for (var i = 0; i < keys.length; i++) {
		      var key = keys[i];

		      if (key !== 'children' && key !== 'key') {
		        setCurrentlyValidatingElement$1(fragment);

		        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

		        setCurrentlyValidatingElement$1(null);
		        break;
		      }
		    }

		    if (fragment.ref !== null) {
		      setCurrentlyValidatingElement$1(fragment);

		      error('Invalid attribute `ref` supplied to `React.Fragment`.');

		      setCurrentlyValidatingElement$1(null);
		    }
		  }
		}

		function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
		  {
		    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
		    // succeed and there will likely be errors in render.

		    if (!validType) {
		      var info = '';

		      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
		        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
		      }

		      var sourceInfo = getSourceInfoErrorAddendum(source);

		      if (sourceInfo) {
		        info += sourceInfo;
		      } else {
		        info += getDeclarationErrorAddendum();
		      }

		      var typeString;

		      if (type === null) {
		        typeString = 'null';
		      } else if (Array.isArray(type)) {
		        typeString = 'array';
		      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
		        typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
		        info = ' Did you accidentally export a JSX literal instead of a component?';
		      } else {
		        typeString = typeof type;
		      }

		      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
		    }

		    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
		    // TODO: Drop this when these are no longer allowed as the type argument.

		    if (element == null) {
		      return element;
		    } // Skip key warning if the type isn't valid since our key validation logic
		    // doesn't expect a non-string/function type and can throw confusing errors.
		    // We don't want exception behavior to differ between dev and prod.
		    // (Rendering will throw with a helpful message and as soon as the type is
		    // fixed, the key warnings will appear.)


		    if (validType) {
		      var children = props.children;

		      if (children !== undefined) {
		        if (isStaticChildren) {
		          if (Array.isArray(children)) {
		            for (var i = 0; i < children.length; i++) {
		              validateChildKeys(children[i], type);
		            }

		            if (Object.freeze) {
		              Object.freeze(children);
		            }
		          } else {
		            error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
		          }
		        } else {
		          validateChildKeys(children, type);
		        }
		      }
		    }

		    if (type === exports.Fragment) {
		      validateFragmentProps(element);
		    } else {
		      validatePropTypes(element);
		    }

		    return element;
		  }
		} // These two functions exist to still get child warnings in dev
		// even with the prod transform. This means that jsxDEV is purely
		// opt-in behavior for better messages but that we won't stop
		// giving you warnings if you use production apis.

		function jsxWithValidationStatic(type, props, key) {
		  {
		    return jsxWithValidation(type, props, key, true);
		  }
		}
		function jsxWithValidationDynamic(type, props, key) {
		  {
		    return jsxWithValidation(type, props, key, false);
		  }
		}

		var jsx =  jsxWithValidationDynamic ; // we may want to special case jsxs internally to take advantage of static children.
		// for now we can ship identical prod functions

		var jsxs =  jsxWithValidationStatic ;

		exports.jsx = jsx;
		exports.jsxs = jsxs;
		  })();
		}
} (reactJsxRuntime_development));
	return reactJsxRuntime_development;
}

(function (module) {

	if (process.env.NODE_ENV === 'production') {
	  module.exports = requireReactJsxRuntime_production_min();
	} else {
	  module.exports = requireReactJsxRuntime_development();
	}
} (jsxRuntime));

var ConnectWalletButtonLayout = function ConnectWalletButtonLayout(_ref) {
  var onClick = _ref.onClick,
    name = _ref.name,
    description = _ref.description,
    logo = _ref.logo;
  return /*#__PURE__*/jsxRuntime.exports.jsxs("button", {
    onClick: onClick,
    className: 'modal-button',
    children: [/*#__PURE__*/React.createElement(logo, {
      alt: 'metamask logo',
      className: 'modal-button__logo'
    }), /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
      className: "modal-button__text-container",
      children: [/*#__PURE__*/jsxRuntime.exports.jsx("h3", {
        className: "modal-button__heading",
        children: name
      }), /*#__PURE__*/jsxRuntime.exports.jsx("p", {
        className: "modal-button__text",
        children: description
      })]
    }), /*#__PURE__*/jsxRuntime.exports.jsx(SvgChevron, {
      className: "modal-button__chevron",
      alt: "#"
    })]
  });
};

var _circle$1, _path$1, _path2, _path3, _path4, _path5, _path6, _path7, _path8, _path9, _path10, _path11, _path12, _path13, _path14;
function _extends$1() { _extends$1 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var SvgMetamaskIcon = function SvgMetamaskIcon(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$1({
    width: 48,
    height: 48,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _circle$1 || (_circle$1 = /*#__PURE__*/React__namespace.createElement("circle", {
    cx: 24,
    cy: 24,
    r: 24,
    fill: "#fff"
  })), _path$1 || (_path$1 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m36.616 11-10.942 8.118 2.032-4.79L36.616 11Z",
    fill: "#E17726",
    stroke: "#E17726",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m11.384 11 10.842 8.195-1.932-4.866L11.384 11ZM32.683 29.817l-2.911 4.46L36 35.99l1.78-6.074-5.097-.099ZM10.23 29.915 12 35.99l6.228-1.713-2.9-4.46-5.098.098Z",
    fill: "#E27625",
    stroke: "#E27625",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path3 || (_path3 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m17.887 22.281-1.736 2.626 6.174.275-.209-6.647-4.23 3.746ZM30.113 22.28l-4.296-3.822-.143 6.724 6.174-.275-1.735-2.626ZM18.227 34.278l3.725-1.814-3.209-2.504-.516 4.318ZM26.048 32.464l3.724 1.814-.516-4.318-3.208 2.504Z",
    fill: "#E27625",
    stroke: "#E27625",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path4 || (_path4 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m29.773 34.277-3.725-1.814.296 2.429-.032 1.021 3.46-1.636ZM18.227 34.277l3.461 1.636-.022-1.021.286-2.429-3.725 1.814Z",
    fill: "#D5BFB2",
    stroke: "#D5BFB2",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path5 || (_path5 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m21.754 28.356-3.098-.912 2.186-1 .912 1.912Z",
    fill: "#233447",
    stroke: "#233447",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path6 || (_path6 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m18.228 34.278.538-4.461-3.438.098 2.9 4.363ZM29.234 29.817l.538 4.46 2.911-4.362-3.449-.098Z",
    fill: "#CC6228",
    stroke: "#CC6228",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path7 || (_path7 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m26.246 28.355.912-1.91 2.197 1-3.11.91Z",
    fill: "#233447",
    stroke: "#233447",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path8 || (_path8 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m31.848 24.907-6.173.275.57 3.173.913-1.91 2.196 1 2.494-2.538ZM18.656 27.444l2.186-1 .912 1.911.57-3.173-6.173-.275 2.505 2.537Z",
    fill: "#CC6228",
    stroke: "#CC6228",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path9 || (_path9 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m16.151 24.907 2.593 5.053-.088-2.516-2.505-2.537ZM29.354 27.444l-.098 2.516 2.592-5.053-2.494 2.537ZM22.325 25.182l-.572 3.173.725 3.746.154-4.932-.307-1.987ZM25.675 25.182l-.297 1.976.143 4.943.725-3.746-.571-3.173Z",
    fill: "#E27525",
    stroke: "#E27525",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path10 || (_path10 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m26.246 28.355-.725 3.746.527.362 3.208-2.503.099-2.516-3.11.911ZM18.656 27.444l.087 2.516 3.209 2.504.526-.363-.725-3.746-3.097-.91Z",
    fill: "#F5841F",
    stroke: "#F5841F",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path11 || (_path11 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m26.312 35.913.033-1.022-.274-.241h-4.142l-.263.241.022 1.022-3.46-1.636 1.208.987 2.46 1.704h4.207l2.461-1.704 1.209-.987-3.46 1.636Z",
    fill: "#C0AC9D",
    stroke: "#C0AC9D",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path12 || (_path12 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m26.048 32.464-.527-.363H22.48l-.527.363-.286 2.428.263-.242h4.142l.273.242-.296-2.428Z",
    fill: "#161616",
    stroke: "#161616",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path13 || (_path13 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M37.077 19.645 38 15.164 36.616 11l-10.568 7.844 4.065 3.437 5.744 1.682 1.264-1.484-.55-.395.88-.802-.67-.527.878-.67-.582-.44ZM10 15.164l.934 4.482-.593.439.879.67-.67.527.878.803-.55.395 1.264 1.483 5.745-1.681 4.065-3.438L11.384 11 10 15.164Z",
    fill: "#763E1A",
    stroke: "#763E1A",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), _path14 || (_path14 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m35.857 23.962-5.744-1.681 1.735 2.626-2.592 5.053 3.427-.044h5.097l-1.923-5.954ZM17.887 22.281l-5.745 1.681-1.912 5.954h5.098l3.416.044-2.593-5.053 1.736-2.626ZM25.674 25.182l.374-6.338 1.658-4.516h-7.413l1.658 4.515.374 6.339.143 1.998.01 4.921h3.043l.01-4.92.143-2Z",
    fill: "#F5841F",
    stroke: "#F5841F",
    strokeWidth: 0.713,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
};

var _circle, _path;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgWalletConnectIcon = function SvgWalletConnectIcon(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: 48,
    height: 48,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _circle || (_circle = /*#__PURE__*/React__namespace.createElement("circle", {
    cx: 24,
    cy: 24,
    r: 24,
    fill: "#fff"
  })), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M15.732 19.242c4.566-4.323 11.97-4.323 16.536 0l.55.52a.533.533 0 0 1 0 .783l-1.88 1.78a.304.304 0 0 1-.414 0l-.756-.716c-3.186-3.016-8.35-3.016-11.536 0l-.81.766a.304.304 0 0 1-.413 0l-1.88-1.78a.533.533 0 0 1 0-.782l.603-.571Zm20.424 3.68 1.673 1.584a.533.533 0 0 1 0 .783l-7.544 7.142a.608.608 0 0 1-.827 0l-5.355-5.07a.152.152 0 0 0-.206 0l-5.355 5.07a.608.608 0 0 1-.826 0l-7.545-7.142a.533.533 0 0 1 0-.783l1.673-1.584a.608.608 0 0 1 .827 0l5.355 5.069c.057.054.15.054.206 0l5.355-5.069a.608.608 0 0 1 .826 0l5.355 5.069c.057.054.15.054.206 0l5.355-5.069a.608.608 0 0 1 .827 0Z",
    fill: "#3396FF"
  })));
};

var MetamaskConnectButton = function MetamaskConnectButton(_ref) {
  var onClick = _ref.onClick;
  return /*#__PURE__*/jsxRuntime.exports.jsx(ConnectWalletButtonLayout, {
    onClick: onClick,
    name: "MetaMask",
    description: "Connect using your browser wallet",
    logo: SvgMetamaskIcon
  });
};
var WalletConnectButton = function WalletConnectButton(_ref2) {
  var onClick = _ref2.onClick;
  return /*#__PURE__*/jsxRuntime.exports.jsx(ConnectWalletButtonLayout, {
    onClick: onClick,
    name: 'WalletConnect',
    description: 'Connect using WalletConnect',
    logo: SvgWalletConnectIcon
  });
};

var WalletModal = function WalletModal(_ref) {
  var toggleModal = _ref.toggleModal,
    loginMetamask = _ref.loginMetamask,
    loginWalletConnect = _ref.loginWalletConnect,
    _ref$isOpen = _ref.isOpen,
    isOpen = _ref$isOpen === void 0 ? false : _ref$isOpen;
  React.useEffect(function () {
    if (isOpen) document.querySelector('body').style.overflow = 'hidden';else document.querySelector('body').style.overflow = '';
  }, [isOpen]);
  var initMetamask = function initMetamask() {
    loginMetamask();
    toggleModal();
  };
  var initWalletConnect = function initWalletConnect() {
    loginWalletConnect();
    toggleModal();
  };
  return isOpen && /*#__PURE__*/reactDom.createPortal( /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
    className: "wallet-modal",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("div", {
      className: "wallet-modal__overlay",
      onClick: toggleModal
    }), /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
      className: "wallet-modal__container",
      children: [/*#__PURE__*/jsxRuntime.exports.jsx("p", {
        className: "wallet-modal__text",
        children: "Please connect a wallet to use AirDAO"
      }), /*#__PURE__*/jsxRuntime.exports.jsx(MetamaskConnectButton, {
        onClick: initMetamask
      }), /*#__PURE__*/jsxRuntime.exports.jsx(WalletConnectButton, {
        onClick: initWalletConnect
      })]
    })]
  }), document.querySelector('body'));
};

var css_248z = "/* width */\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n  background: rgba(168, 183, 218, 0.5098039216);\n  border-radius: 5px;\n}\n\n/* Handle on hover */\n::-webkit-scrollbar-thumb:hover {\n  background: rgba(168, 183, 218, 0.5098039216);\n}\n\n.body {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n.side-menu-container {\n  position: fixed;\n  padding: 16px 0;\n  height: fit-content;\n  margin-left: 16px;\n  width: 320px;\n  z-index: 1000;\n  max-height: -webkit-fill-available;\n}\n@media only screen and (max-width: 428px) {\n  .side-menu-container {\n    width: 100%;\n    padding: 0;\n    margin-left: 0;\n  }\n}\n\n.side-menu {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  padding: 16px 24px;\n  width: 100%;\n  z-index: 999999;\n  background: #ffffff;\n  box-shadow: 0 8px 32px rgba(105, 142, 226, 0.24);\n  border-radius: 0 0 16px 0;\n  font-family: Inter, sans-serif;\n  box-sizing: border-box;\n  height: 64px;\n  overflow: hidden;\n}\n@media only screen and (max-width: 428px) {\n  .side-menu {\n    border-radius: 0;\n  }\n}\n.side-menu_expanded {\n  max-height: calc(100vh - 32px);\n  height: fit-content !important;\n  width: 100%;\n  border-radius: 8px;\n}\n@media only screen and (max-width: 720px) {\n  .side-menu_expanded {\n    max-height: 100vh;\n  }\n}\n@media only screen and (max-width: 428px) {\n  .side-menu_expanded {\n    padding-bottom: 100px !important;\n    border-radius: 0;\n  }\n}\n.side-menu p,\n.side-menu span,\n.side-menu button,\n.side-menu a {\n  font-family: Inter, sans-serif;\n  font-weight: 300;\n  line-height: 140%;\n  color: #1d1d1d;\n}\n\n.side-menu__mobile-wrapper {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 272px;\n  height: 32px;\n}\n@media only screen and (max-width: 428px) {\n  .side-menu__mobile-wrapper {\n    width: 100%;\n  }\n}\n\n.side-menu__logo {\n  height: 32px;\n  width: auto;\n}\n.side-menu__connect-wallet {\n  display: flex;\n  margin-top: 40px;\n  column-gap: 8px;\n  align-items: center;\n  justify-content: center;\n  background: rgba(69, 126, 255, 0.07);\n  /* BRAND BLUE */\n  border: 1.5px solid #457eff;\n  border-radius: 16px;\n  color: #3568dd !important;\n  padding: 0 18px;\n  height: 58px;\n  font-size: 16px;\n  font-weight: 500;\n}\n.side-menu__connect-text {\n  display: flex;\n  align-items: center;\n  text-align: center;\n  color: #a2b2d8;\n  font-size: 12px;\n  margin-top: 8px;\n  font-weight: 400;\n  line-height: 15px;\n  padding: 0 24px;\n}\n\n.side-menu__content {\n  display: flex;\n  flex-direction: column;\n  padding: 0 !important;\n}\n\n.side-menu__title {\n  color: rgba(69, 126, 255, 0.45);\n  font-size: 14px;\n  padding-left: 11px;\n  border-bottom: 1px solid rgba(69, 126, 255, 0.45);\n  margin-top: 27px;\n  display: block;\n}\n\n.side-menu__content-list {\n  margin-bottom: 28px;\n  margin-top: 4px;\n}\n\n.side-menu__list {\n  display: flex;\n  flex-direction: column;\n  row-gap: 16px;\n  padding-left: 0;\n  list-style: none;\n  margin: 0;\n}\n.side-menu__list a {\n  color: #0e0e0e;\n  text-decoration: none;\n  font-family: Inter, sans-serif;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.side-menu__list li {\n  height: 24px;\n  font-family: Inter, sans-serif;\n  font-style: normal;\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 24px;\n  color: #1d1d1d;\n}\n.side-menu__list svg {\n  margin-right: 5px;\n  width: 24px;\n  height: 24px;\n}\n.side-menu__list_socials {\n  display: flex;\n  margin-top: 35px;\n  padding-left: 0;\n  list-style: none;\n}\n.side-menu__list_socials-item:hover {\n  filter: invert(37%) sepia(61%) saturate(3651%) hue-rotate(212deg) brightness(90%) contrast(92%);\n}\n.side-menu__list_socials-item:hover svg path {\n  stroke: #457eff;\n}\n.side-menu__list_socials-item > img > svg {\n  background-color: #3568dd;\n}\n.side-menu__list_socials li {\n  margin: 0 32px 0 0;\n}\n.side-menu__list_socials-icon:hover {\n  color: #457eff;\n}\n.side-menu__list_small li {\n  display: flex;\n  column-gap: 10px;\n}\n.side-menu__list_small a {\n  font-family: Inter, sans-serif;\n  font-size: 12px;\n  line-height: 24px;\n  font-weight: 400;\n  color: #1d1d1d;\n}\n\n.side-menu__listmenu {\n  display: flex;\n  flex-direction: column;\n  margin-top: 24px;\n  row-gap: 16px;\n}\n.side-menu__listmenu-wrapper {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  cursor: pointer;\n  background-color: #fff;\n  border: 0;\n}\n.side-menu__listmenu-text {\n  font-family: Inter, sans-serif;\n  font-style: normal;\n  font-weight: 500;\n  font-size: 16px;\n  line-height: 24px;\n  color: #1d1d1d;\n}\n.side-menu__blue {\n  color: #3568dd;\n}\n.side-menu__blue b {\n  color: #3568dd;\n}\n\n.side-menu__list-link {\n  display: flex;\n  align-items: center;\n  height: 24px;\n}\n.side-menu__list-link_active {\n  color: #457eff;\n}\n.side-menu__list-link_active svg {\n  display: block;\n}\n.side-menu__list-link svg {\n  position: absolute;\n  right: 30px;\n}\n.side-menu__list-link:hover svg {\n  display: block;\n}\n\n.learn-more-btn {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 24px;\n  width: 80px;\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 24px;\n  color: #457eff;\n  border: 1px solid #457eff;\n  border-radius: 8px;\n}\n.learn-more-btn:hover {\n  opacity: 70%;\n}\n\n.side-menu__list-vote {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.side-menu__list-vote span {\n  color: #a2b2d8;\n}\n.side-menu__list-vote span:last-child {\n  display: none;\n  font-size: 11px;\n  padding: 4px 8px;\n  margin-left: 8px;\n  border-radius: 4px;\n  border: 1px solid #a2b2d8;\n  left: 110px;\n}\n.side-menu__list-vote:hover span:last-child {\n  display: block;\n}\n\n.side-menu__connect-mobile {\n  width: fit-content;\n  height: fit-content;\n  padding: 10px;\n  border-radius: 13px;\n  margin-left: auto;\n  margin-bottom: 0;\n  margin-right: 7px;\n  border: 2px solid #0e0e0e;\n}\n.side-menu__connect-mobile_connected {\n  border: 0;\n}\n\n.side-menu__hamburger {\n  display: flex;\n  border-radius: 15px;\n  height: 44px;\n  align-items: center;\n  justify-content: center;\n  border: 0;\n  padding: 0;\n  cursor: pointer;\n  background: #fff;\n}\n\n.side-menu__address-block-title {\n  font-size: 14px;\n  padding-left: 11px;\n  color: rgba(69, 126, 255, 0.6509803922);\n  display: block;\n  margin-top: 33px;\n}\n@media only screen and (max-width: 720px) {\n  .side-menu__address-block-title {\n    margin-top: 20px;\n  }\n}\n\n.address-block {\n  background: rgba(69, 126, 255, 0.0705882353);\n  padding: 17px 0 17px 22px;\n  display: flex;\n  align-items: center;\n  border-radius: 15px;\n  margin-top: 30px;\n  box-sizing: border-box;\n}\n.address-block span {\n  font-family: sans-serif;\n}\n.address-block button {\n  width: 32px;\n  height: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 2px;\n}\n\n.address-block__metamask-icon {\n  margin-right: 22px;\n}\n\n.address-block__copy {\n  margin-left: 5px;\n  margin-right: 8px;\n}\n\n.side-menu__address {\n  font-family: sans-serif;\n  margin-left: auto;\n  margin-right: 15px;\n}\n\n.side-menu__guide {\n  display: flex;\n  align-items: center;\n  width: fit-content;\n  margin: auto 0 0;\n  text-decoration: none;\n}\n@media only screen and (max-width: 720px) {\n  .side-menu__guide {\n    margin: 20px auto;\n  }\n}\n\n.side-menu__list_small li {\n  display: flex;\n  align-items: center;\n}\n.side-menu__list_small li img {\n  margin-right: 8px;\n}\n\n.menu-overlay {\n  position: fixed;\n  width: 100%;\n  height: 100vh;\n  background: #457eff;\n  opacity: 0.5;\n  z-index: 999;\n}\n\n.side-menu__list_socials-item--last:hover path {\n  fill: #457eff;\n  stroke: none !important;\n}\n\n.side-menu__list_socials-item--reddit:hover circle {\n  fill: #457eff;\n}\n\n.side-menu__nav-wrapper {\n  overflow: auto;\n  max-height: calc(100vh - 280px);\n  margin-top: 24px;\n  padding-right: 10px;\n}";
styleInject(css_248z);

var repositoryName = 'airdao';
var client = prismic__namespace.createClient(repositoryName, {
  accessToken: process.env.REACT_APP_PRISMIC_ACCESS_TOKEN,
  routes: [{
    type: 'homepage',
    path: '/'
  }, {
    type: 'bridge',
    path: '/bridge'
  }, {
    type: 'firepot',
    path: '/firepot'
  }, {
    type: 'staking',
    path: '/staking'
  }, {
    type: 'explorer',
    path: '/explorer'
  }, {
    type: 'team',
    path: '/team'
  }, {
    type: 'binance',
    path: '/binance'
  }]
});

var usePrismicPageData = function usePrismicPageData(type) {
  var _useSinglePrismicDocu = react.useSinglePrismicDocument(type),
    _useSinglePrismicDocu2 = _slicedToArray(_useSinglePrismicDocu, 1),
    document = _useSinglePrismicDocu2[0];
  return document ? document.data : undefined;
};

var Logo = function Logo() {
  return /*#__PURE__*/jsxRuntime.exports.jsxs("svg", {
    width: "149",
    height: "32",
    viewBox: "0 0 149 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M55.6433 24.6803C55.6618 24.7174 55.6714 24.7584 55.6714 24.7999C55.6714 24.9483 55.5512 25.0685 55.4028 25.0685H54.2186C53.7819 25.0685 53.3833 24.8197 53.1917 24.4273L51.3739 20.706C51.1822 20.3136 50.7836 20.0647 50.3469 20.0647L40.9417 20.0647C40.505 20.0647 40.1064 20.3136 39.9147 20.706L38.097 24.4273C37.9053 24.8197 37.5067 25.0685 37.07 25.0685H35.8858C35.7374 25.0685 35.6172 24.9483 35.6172 24.7999C35.6172 24.7584 35.6268 24.7174 35.6453 24.6803L44.1623 7.5667C44.3556 7.17845 44.7519 6.93301 45.1855 6.93301H46.1031C46.5367 6.93301 46.933 7.17845 47.1263 7.5667L55.6433 24.6803ZM48.2764 18.1094C49.1238 18.1094 49.6765 17.2197 49.301 16.4601L46.6689 11.1347C46.2494 10.286 45.0392 10.286 44.6197 11.1347L41.9876 16.4601C41.6121 17.2197 42.1648 18.1094 43.0122 18.1094H48.2764Z",
      fill: "#3568DD"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M59.922 6.93301C60.5126 6.93301 60.9914 7.41178 60.9914 8.00238V23.9992C60.9914 24.5898 60.5126 25.0685 59.922 25.0685C59.3314 25.0685 58.8526 24.5898 58.8526 23.9992V8.00238C58.8526 7.41178 59.3314 6.93301 59.922 6.93301Z",
      fill: "#3568DD"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M83.7629 12.5174C83.7629 14.0472 83.1889 15.2728 82.0408 16.1943C80.8927 17.0974 79.8403 17.5489 75.9239 17.5489C75.8704 17.5489 75.8423 17.6123 75.8781 17.6519L82.2227 24.6684C82.2625 24.7124 82.2845 24.7697 82.2845 24.829C82.2845 24.9613 82.1773 25.0685 82.045 25.0685H80.346C80.0239 25.0685 79.7168 24.9326 79.5001 24.6942L73.3475 17.9232C73.1309 17.6848 72.8237 17.5489 72.5016 17.5489H69.5179C68.8867 17.5489 68.375 18.0606 68.375 18.6918V24.0131C68.375 24.596 67.9025 25.0685 67.3195 25.0685C66.7366 25.0685 66.264 24.596 66.264 24.0131V8.07592C66.264 7.44471 66.7757 6.93301 67.407 6.93301L77.3467 6.93301C79.3465 6.93301 80.9112 7.40298 82.0408 8.34294C83.1889 9.26446 83.7629 10.5362 83.7629 12.158V12.5174ZM77.2911 15.669C78.6429 15.669 79.6984 15.3834 80.4576 14.812C81.2353 14.2407 81.6242 13.4482 81.6242 12.4345V12.0751C81.6242 11.0614 81.2445 10.2689 80.4853 9.69757C79.7261 9.12623 78.6614 8.84056 77.2911 8.84056H69.5179C68.8867 8.84056 68.375 9.35226 68.375 9.98347V14.5261C68.375 15.1573 68.8867 15.669 69.5179 15.669L77.2911 15.669Z",
      fill: "#3568DD"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M96.3639 6.93301C99.5859 6.93301 102.049 7.68866 103.752 9.19995C105.456 10.7112 106.308 12.9045 106.308 15.7796V16.2496C106.308 19.1247 105.456 21.318 103.752 22.8292C102.067 24.3221 99.6044 25.0685 96.3639 25.0685H89.2295C88.5983 25.0685 88.0866 24.5568 88.0866 23.9256V8.07592C88.0866 7.44471 88.5983 6.93301 89.2295 6.93301L96.3639 6.93301ZM96.3639 23.161C98.9378 23.161 100.873 22.5896 102.169 21.447C103.484 20.2858 104.141 18.5626 104.141 16.2772V15.752C104.141 13.485 103.484 11.771 102.169 10.6099C100.854 9.43033 98.91 8.84056 96.3361 8.84056H91.3405C90.7093 8.84056 90.1976 9.35226 90.1976 9.98347V22.0181C90.1976 22.6493 90.7093 23.161 91.3405 23.161H96.3639Z",
      fill: "#3568DD"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M127.337 24.6803C127.355 24.7174 127.365 24.7584 127.365 24.7999C127.365 24.9483 127.245 25.0685 127.096 25.0685H125.912C125.475 25.0685 125.077 24.8197 124.885 24.4273L123.067 20.706C122.876 20.3136 122.477 20.0647 122.04 20.0647H112.635C112.198 20.0647 111.8 20.3136 111.608 20.706L109.79 24.4273C109.599 24.8197 109.2 25.0685 108.763 25.0685H107.579C107.431 25.0685 107.311 24.9483 107.311 24.7999C107.311 24.7584 107.32 24.7174 107.339 24.6803L115.856 7.5667C116.049 7.17845 116.445 6.93301 116.879 6.93301H117.797C118.23 6.93301 118.626 7.17845 118.82 7.5667L127.337 24.6803ZM119.97 18.1094C120.817 18.1094 121.37 17.2197 120.994 16.4601L118.362 11.1347C117.943 10.286 116.733 10.286 116.313 11.1347L113.681 16.4601C113.306 17.2197 113.858 18.1094 114.706 18.1094H119.97Z",
      fill: "#3568DD"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M138.572 25.3726C136.498 25.3726 134.692 25.004 133.155 24.2668C131.618 23.5112 130.433 22.4422 129.6 21.0599C128.767 19.6776 128.35 18.065 128.35 16.2219V15.8073C128.35 13.9458 128.767 12.3239 129.6 10.9416C130.433 9.55934 131.618 8.49959 133.155 7.76238C134.692 7.00673 136.498 6.62891 138.572 6.62891C140.627 6.62891 142.423 7.00673 143.96 7.76238C145.497 8.51802 146.682 9.58699 147.515 10.9693C148.349 12.3516 148.765 13.9642 148.765 15.8073V16.2219C148.765 18.065 148.349 19.6776 147.515 21.0599C146.682 22.4422 145.497 23.5112 143.96 24.2668C142.423 25.004 140.627 25.3726 138.572 25.3726ZM138.572 23.4098C141.09 23.4098 143.053 22.774 144.46 21.5023C145.886 20.2306 146.599 18.4797 146.599 16.2496V15.7796C146.599 13.5495 145.886 11.7986 144.46 10.5269C143.034 9.23681 141.071 8.59175 138.572 8.59175C136.053 8.59175 134.072 9.23681 132.628 10.5269C131.202 11.7986 130.489 13.5495 130.489 15.7796V16.2496C130.489 18.4797 131.202 20.2306 132.628 21.5023C134.072 22.774 136.053 23.4098 138.572 23.4098Z",
      fill: "#3568DD"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.21951 31.9331C1.01129 32.0601 0.740088 32.0012 0.603204 31.7994L0.0789005 31.0264C-0.057983 30.8245 -0.0120187 30.5512 0.18004 30.4009C1.9069 29.0497 3.32636 27.5267 4.44268 25.8955C8.59931 19.8217 8.59931 12.1783 4.44268 6.10452C3.32636 4.47331 1.9069 2.95031 0.180041 1.59909C-0.0120176 1.44881 -0.057982 1.17547 0.0789015 0.97365L0.603206 0.200602C0.740089 -0.00122233 1.01129 -0.0600739 1.21952 0.0668597L24.509 14.264C25.8088 15.0564 25.8088 16.9436 24.509 17.736L1.21951 31.9331Z",
      fill: "url(#paint0_linear_2483_8404)"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("defs", {
      children: /*#__PURE__*/jsxRuntime.exports.jsxs("linearGradient", {
        id: "paint0_linear_2483_8404",
        x1: "28.4583",
        y1: "16.2834",
        x2: "-9.3721",
        y2: "16.2834",
        gradientUnits: "userSpaceOnUse",
        children: [/*#__PURE__*/jsxRuntime.exports.jsx("stop", {
          stopColor: "#3568DD"
        }), /*#__PURE__*/jsxRuntime.exports.jsx("stop", {
          offset: "1",
          stopColor: "#3568DD",
          stopOpacity: "0.66"
        })]
      })
    })]
  });
};

var Close = function Close() {
  return /*#__PURE__*/jsxRuntime.exports.jsxs("svg", {
    width: "25",
    height: "26",
    viewBox: "0 0 25 26",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1.18628 1.68604L23.8137 24.3135",
      stroke: "#3568DD",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1.18628 24.3135L23.8137 1.68606",
      stroke: "#3568DD",
      strokeWidth: "2",
      strokeLinecap: "round"
    })]
  });
};

var Menu$1 = function Menu() {
  return /*#__PURE__*/jsxRuntime.exports.jsxs("svg", {
    width: "34",
    height: "26",
    viewBox: "0 0 34 26",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1 1H33",
      stroke: "#3568DD",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1 13H33",
      stroke: "#3568DD",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1 25H33",
      stroke: "#3568DD",
      strokeWidth: "2",
      strokeLinecap: "round"
    })]
  });
};

var Metamask = function Metamask() {
  return /*#__PURE__*/jsxRuntime.exports.jsxs("svg", {
    width: "22",
    height: "20",
    viewBox: "0 0 22 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M19.5369 1.20001L11.979 6.88781L13.3846 3.53108L19.5369 1.20001Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M2.07129 1.20001L9.58308 6.93444L8.24663 3.53108L2.07129 1.20001Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M16.8178 14.3701L14.79 17.4937L19.122 18.7059L20.3432 14.44L16.8178 14.3701Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1.28735 14.44L2.5086 18.7059L6.8175 17.4937L4.81283 14.3701L1.28735 14.44Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M6.58736 9.10225L5.38916 10.9438L9.65199 11.1303L9.51374 6.46814L6.58736 9.10225Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M15.0436 9.10272L12.0712 6.422L11.979 11.1308L16.2418 10.9443L15.0436 9.10272Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M6.81787 17.4944L9.39861 16.2356L7.16351 14.464L6.81787 17.4944Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M12.2327 16.2356L14.7904 17.4944L14.4447 14.464L12.2327 16.2356Z",
      fill: "#E27625",
      stroke: "#E27625",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M14.7904 17.4939L12.2327 16.2352L12.44 17.9135L12.417 18.6362L14.7904 17.4939Z",
      fill: "#D5BFB2",
      stroke: "#D5BFB2",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M6.81787 17.4939L9.21427 18.6362L9.19123 17.9135L9.39861 16.2352L6.81787 17.4939Z",
      fill: "#D5BFB2",
      stroke: "#D5BFB2",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M9.25988 13.3446L7.11694 12.7153L8.61469 12.0159L9.25988 13.3446Z",
      fill: "#233447",
      stroke: "#233447",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M12.3706 13.3446L12.9927 12.0159L14.5135 12.7153L12.3706 13.3446Z",
      fill: "#233447",
      stroke: "#233447",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M6.81767 17.4942L7.18634 14.3705L4.81299 14.4405L6.81767 17.4942Z",
      fill: "#CC6228",
      stroke: "#CC6228",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M14.4448 14.3705L14.7905 17.4942L16.8182 14.4405L14.4448 14.3705Z",
      fill: "#CC6228",
      stroke: "#CC6228",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M16.2418 10.9442L11.979 11.1307L12.3707 13.3452L12.9929 12.0165L14.5137 12.7158L16.2418 10.9442Z",
      fill: "#CC6228",
      stroke: "#CC6228",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M7.11709 12.7158L8.61484 12.0165L9.26002 13.3452L9.65174 11.1307L5.38892 10.9442L7.11709 12.7158Z",
      fill: "#CC6228",
      stroke: "#CC6228",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M5.38916 10.9442L7.16342 14.4641L7.11733 12.7158L5.38916 10.9442Z",
      fill: "#E27525",
      stroke: "#E27525",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M14.5135 12.7158L14.4443 14.4641L16.2416 10.9442L14.5135 12.7158Z",
      fill: "#E27525",
      stroke: "#E27525",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M9.65246 11.1304L9.26074 13.3449L9.74463 15.9791L9.85984 12.5058L9.65246 11.1304Z",
      fill: "#E27525",
      stroke: "#E27525",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M11.9798 11.1304L11.7725 12.5058L11.8646 15.9791L12.3716 13.3449L11.9798 11.1304Z",
      fill: "#E27525",
      stroke: "#E27525",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M12.3705 13.3447L11.8635 15.9788L12.2322 16.2352L14.4443 14.4636L14.5134 12.7153L12.3705 13.3447Z",
      fill: "#F5841F",
      stroke: "#F5841F",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M7.11694 12.7153L7.16303 14.4636L9.39813 16.2352L9.74377 15.9788L9.25988 13.3447L7.11694 12.7153Z",
      fill: "#F5841F",
      stroke: "#F5841F",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M12.4171 18.6365L12.4402 17.9139L12.2328 17.7507H9.37556L9.19123 17.9139L9.21427 18.6365L6.81787 17.4943L7.64739 18.1936L9.35252 19.3825H12.2559L13.961 18.1936L14.7905 17.4943L12.4171 18.6365Z",
      fill: "#C0AC9D",
      stroke: "#C0AC9D",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M12.2323 16.2347L11.8636 15.9783H9.74369L9.39805 16.2347L9.19067 17.9131L9.37501 17.7499H12.2323L12.4396 17.9131L12.2323 16.2347Z",
      fill: "#161616",
      stroke: "#161616",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M19.8597 7.26078L20.5049 4.11384L19.5371 1.20001L12.2327 6.70133L15.0438 9.10233L19.0071 10.2679L19.8827 9.24219L19.514 8.96246L20.1131 8.40301L19.6523 8.03004L20.2514 7.56382L19.8597 7.26078Z",
      fill: "#763E1A",
      stroke: "#763E1A",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1.12622 4.11384L1.7714 7.26078L1.35664 7.56382L1.95574 8.03004L1.4949 8.40301L2.11704 8.96246L1.72532 9.24219L2.60093 10.2679L6.58724 9.10233L9.39841 6.70133L2.07095 1.20001L1.12622 4.11384Z",
      fill: "#763E1A",
      stroke: "#763E1A",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M19.0067 10.268L15.0434 9.10242L16.2416 10.944L14.4443 14.4639L16.8177 14.4406H20.3432L19.0067 10.268Z",
      fill: "#F5841F",
      stroke: "#F5841F",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M6.58708 9.10242L2.60077 10.268L1.28735 14.4406H4.81282L7.16314 14.4639L5.38888 10.944L6.58708 9.10242Z",
      fill: "#F5841F",
      stroke: "#F5841F",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M11.9794 11.1306L12.2329 6.70156L13.385 3.53131H8.24658L9.3987 6.70156L9.65216 11.1306L9.74433 12.5292V15.9792H11.8642V12.5292L11.9794 11.1306Z",
      fill: "#F5841F",
      stroke: "#F5841F",
      strokeWidth: "0.995984",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })]
  });
};

var Logout = function Logout() {
  return /*#__PURE__*/jsxRuntime.exports.jsxs("svg", {
    width: "33",
    height: "33",
    viewBox: "0 0 33 33",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M23.6667 16.0239H14.6667",
      stroke: "#1D1D1D",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M20.6667 13.0239L23.6667 16.0239L20.6667 19.0239",
      stroke: "#1D1D1D",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M16.6667 9.02393H9.66675V23.0239H16.6667",
      stroke: "#1D1D1D",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })]
  });
};

var Check = function Check() {
  return /*#__PURE__*/jsxRuntime.exports.jsxs("svg", {
    width: "41",
    height: "40",
    viewBox: "0 0 41 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M6.42188 19.2878L16.4059 29.2718",
      stroke: "#15D378",
      strokeWidth: "2.48437",
      "stroke-linecap": "square"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M35.1992 10.4785L16.4059 29.2719",
      stroke: "#15D378",
      strokeWidth: "2.48437",
      "stroke-linecap": "square"
    })]
  });
};

var Copy = function Copy() {
  return /*#__PURE__*/jsxRuntime.exports.jsx("svg", {
    width: "32",
    height: "33",
    viewBox: "0 0 32 33",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M19 13.0239V8.35726C19 7.62088 18.403 7.02393 17.6667 7.02393H8.33333C7.59695 7.02393 7 7.62088 7 8.35726V17.6906C7 18.427 7.59695 19.0239 8.33333 19.0239H13M23.6667 13.0239H14.3333C13.597 13.0239 13 13.6209 13 14.3573V23.6906C13 24.427 13.597 25.0239 14.3333 25.0239H23.6667C24.403 25.0239 25 24.427 25 23.6906V14.3573C25 13.6209 24.403 13.0239 23.6667 13.0239Z",
      stroke: "#1D1D1D",
      strokeWidth: "1.5"
    })
  });
};

var AddressBlock = function AddressBlock(_ref) {
  var _ref$address = _ref.address,
    address = _ref$address === void 0 ? '' : _ref$address,
    logout = _ref.logout;
  var _useState = React.useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isCopied = _useState2[0],
    setIsCopied = _useState2[1];
  var copyToClipboard = function copyToClipboard() {
    setIsCopied(true);
    setTimeout(function () {
      return setIsCopied(false);
    }, 1000);
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(address);
    }
    return null;
  };
  return /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
    className: "address-block",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("div", {
      className: "address-block__metamask-icon",
      children: /*#__PURE__*/jsxRuntime.exports.jsx(Metamask, {})
    }), /*#__PURE__*/jsxRuntime.exports.jsx("span", {
      children: "".concat(address.slice(0, 4), "...").concat(address.slice(address.length - 4, address.length))
    }), /*#__PURE__*/jsxRuntime.exports.jsx("button", {
      onClick: logout,
      type: "button",
      style: {
        marginLeft: 'auto'
      },
      children: /*#__PURE__*/jsxRuntime.exports.jsx(Logout, {})
    }), /*#__PURE__*/jsxRuntime.exports.jsx("button", {
      onClick: copyToClipboard,
      type: "button",
      className: "address-block__copy",
      children: isCopied ? /*#__PURE__*/jsxRuntime.exports.jsx(Check, {}) : /*#__PURE__*/jsxRuntime.exports.jsx(Copy, {})
    })]
  });
};

var Wallet = function Wallet() {
  return /*#__PURE__*/jsxRuntime.exports.jsxs("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M4.75 8.28003V16.78C4.75 17.8846 5.64543 18.78 6.75 18.78H17.25C18.3546 18.78 19.25 17.8846 19.25 16.78V10.28C19.25 9.17546 18.3546 8.28003 17.25 8.28003H15.25M4.75 8.28003V7.28003C4.75 6.17546 5.64543 5.28003 6.75 5.28003H13.25C14.3546 5.28003 15.25 6.17546 15.25 7.28003V8.28003M4.75 8.28003H15.25",
      stroke: "#457EFF",
      strokeWidth: "1.5"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M14.25 13.53L16.25 13.53",
      stroke: "#457EFF",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })]
  });
};

var LearnMoreBtn = function LearnMoreBtn() {
  return /*#__PURE__*/jsxRuntime.exports.jsx("div", {
    className: "learn-more-btn",
    children: "Learn more"
  });
};

var ArrowUp = function ArrowUp() {
  return /*#__PURE__*/jsxRuntime.exports.jsx("svg", {
    width: "14",
    height: "9",
    viewBox: "0 0 14 9",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M13 8.02991L7 2.02991L1 8.02991",
      stroke: "#1D1D1D",
      strokeWidth: "1.5"
    })
  });
};

var ArrowDown = function ArrowDown() {
  return /*#__PURE__*/jsxRuntime.exports.jsx("svg", {
    width: "14",
    height: "9",
    viewBox: "0 0 14 9",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: /*#__PURE__*/jsxRuntime.exports.jsx("path", {
      d: "M1 0.969971L7 6.96997L13 0.969971",
      stroke: "#1D1D1D",
      strokeWidth: "1.5"
    })
  });
};

var Submenu = function Submenu(_ref) {
  var submenu = _ref.submenu;
  var _useState = React.useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  return /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
    className: "side-menu__listmenu",
    children: [/*#__PURE__*/jsxRuntime.exports.jsxs("button", {
      className: "side-menu__listmenu-wrapper ",
      onClick: function onClick() {
        return setIsOpen(function (prev) {
          return !prev;
        });
      },
      children: [/*#__PURE__*/jsxRuntime.exports.jsx("div", {
        className: "side-menu__listmenu-text",
        children: /*#__PURE__*/jsxRuntime.exports.jsx(react.PrismicText, {
          field: submenu === null || submenu === void 0 ? void 0 : submenu.primary.heading
        })
      }), /*#__PURE__*/jsxRuntime.exports.jsx("div", {
        className: "side-menu__listmenu-btn",
        children: isOpen ? /*#__PURE__*/jsxRuntime.exports.jsx(ArrowUp, {}) : /*#__PURE__*/jsxRuntime.exports.jsx(ArrowDown, {})
      })]
    }), /*#__PURE__*/jsxRuntime.exports.jsx("ul", {
      className: "side-menu__list side-menu__list_small",
      style: {
        display: isOpen ? '' : 'none'
      },
      children: submenu === null || submenu === void 0 ? void 0 : submenu.items.map(function (_ref2) {
        var icon = _ref2.icon,
          name = _ref2.name,
          link = _ref2.link;
        return /*#__PURE__*/jsxRuntime.exports.jsxs("li", {
          children: [/*#__PURE__*/jsxRuntime.exports.jsx("img", {
            src: icon.url,
            alt: icon.alt
          }), /*#__PURE__*/jsxRuntime.exports.jsx("a", {
            href: link.url,
            target: link.target,
            children: name
          })]
        }, name);
      })
    })]
  });
};

var MenuBody = function MenuBody(_ref) {
  var address = _ref.address,
    login = _ref.login,
    logout = _ref.logout,
    initHidden = _ref.initHidden,
    customLogo = _ref.customLogo;
  var _useState = React.useState(initHidden ? false : window.innerWidth > 1050),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  var _useState3 = React.useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    overlayVisible = _useState4[0],
    setOverlayVisible = _useState4[1];
  React.useEffect(function () {
    var handleResize = function handleResize() {
      setIsOpen(initHidden ? false : window.innerWidth > 1050);
      setOverlayVisible(false);
    };
    window.addEventListener('resize', handleResize, true);
  }, []);
  var handleOpen = function handleOpen() {
    setOverlayVisible(!isOpen && window.innerWidth < 1050);
    setIsOpen(function (state) {
      return !state;
    });
  };
  var href = window.location.href;
  var currentApp = '';
  if (href.includes('staking')) {
    currentApp = 'staking';
  } else if (href.includes('explorer')) {
    currentApp = 'explorer';
  } else if (href.includes('firepot')) {
    currentApp = 'firepot';
  } else if (href.includes('bridge')) {
    currentApp = 'bridge';
  }
  var data = usePrismicPageData('menu');
  return /*#__PURE__*/jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment, {
    children: [overlayVisible && /*#__PURE__*/jsxRuntime.exports.jsx("div", {
      onClick: handleOpen,
      className: "menu-overlay"
    }), /*#__PURE__*/jsxRuntime.exports.jsx("div", {
      className: "side-menu-container",
      children: /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
        className: "side-menu".concat(isOpen ? ' side-menu_expanded' : ''),
        children: [/*#__PURE__*/jsxRuntime.exports.jsxs("div", {
          className: "side-menu__mobile-wrapper",
          children: [/*#__PURE__*/jsxRuntime.exports.jsx("div", {
            className: "side-menu__logo",
            children: /*#__PURE__*/jsxRuntime.exports.jsx("a", {
              href: "/",
              children: customLogo || /*#__PURE__*/jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment, {
                children: /*#__PURE__*/jsxRuntime.exports.jsx(Logo, {})
              })
            })
          }), /*#__PURE__*/jsxRuntime.exports.jsx("button", {
            type: "button",
            onClick: handleOpen,
            className: "side-menu__hamburger",
            children: isOpen ? /*#__PURE__*/jsxRuntime.exports.jsx(Close, {}) : /*#__PURE__*/jsxRuntime.exports.jsx(Menu$1, {})
          })]
        }), isOpen && /*#__PURE__*/jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment, {
          children: /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
            className: "side-menu__content",
            children: [address ? /*#__PURE__*/jsxRuntime.exports.jsx(AddressBlock, {
              address: address,
              logout: logout
            }) : /*#__PURE__*/jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment, {
              children: [/*#__PURE__*/jsxRuntime.exports.jsxs("button", {
                type: "button",
                className: "side-menu__connect-wallet",
                onClick: login,
                children: [/*#__PURE__*/jsxRuntime.exports.jsx(Wallet, {}), "Connect wallet"]
              }), /*#__PURE__*/jsxRuntime.exports.jsx("div", {
                className: "side-menu__connect-text",
                children: "Your AirDAO experience will be limited without connecting"
              })]
            }), /*#__PURE__*/jsxRuntime.exports.jsxs("div", {
              className: "side-menu__nav-wrapper",
              children: [/*#__PURE__*/jsxRuntime.exports.jsx("div", {
                className: "side-menu__content-list",
                children: /*#__PURE__*/jsxRuntime.exports.jsx("ul", {
                  className: "side-menu__list",
                  children: data === null || data === void 0 ? void 0 : data.links.map(function (_ref2) {
                    var name = _ref2.name,
                      link = _ref2.link,
                      guide_link = _ref2.guide_link,
                      isdisabled = _ref2.isdisabled;
                    return !isdisabled ? /*#__PURE__*/jsxRuntime.exports.jsx("li", {
                      children: /*#__PURE__*/jsxRuntime.exports.jsxs("a", {
                        className: "side-menu__list-link".concat(currentApp === link.type ? 'side-menu__list-link_active' : ''),
                        href: link.url,
                        children: [name, guide_link.url && currentApp === link.type && /*#__PURE__*/jsxRuntime.exports.jsx("a", {
                          href: guide_link.url,
                          target: guide_link.target,
                          children: /*#__PURE__*/jsxRuntime.exports.jsx(LearnMoreBtn, {})
                        })]
                      })
                    }, name) : /*#__PURE__*/jsxRuntime.exports.jsxs("li", {
                      className: "side-menu__list-vote",
                      children: [/*#__PURE__*/jsxRuntime.exports.jsx("span", {
                        children: name
                      }), /*#__PURE__*/jsxRuntime.exports.jsx("span", {
                        children: "Coming Soon"
                      })]
                    }, name);
                  })
                })
              }), data === null || data === void 0 ? void 0 : data.body.map(function (submenu) {
                return /*#__PURE__*/jsxRuntime.exports.jsx(Submenu, {
                  submenu: submenu
                }, submenu === null || submenu === void 0 ? void 0 : submenu.id);
              }), /*#__PURE__*/jsxRuntime.exports.jsx("div", {
                children: /*#__PURE__*/jsxRuntime.exports.jsx("ul", {
                  className: " side-menu__list_socials filter-green",
                  children: data === null || data === void 0 ? void 0 : data.socials.map(function (_ref3) {
                    var icon = _ref3.icon,
                      link = _ref3.link;
                    return /*#__PURE__*/jsxRuntime.exports.jsx("li", {
                      children: /*#__PURE__*/jsxRuntime.exports.jsx("a", {
                        href: link.url,
                        target: link.target,
                        className: "side-menu__list_socials-item",
                        children: /*#__PURE__*/jsxRuntime.exports.jsx("img", {
                          src: icon.url,
                          alt: icon.alt,
                          className: "side-menu__list_socials-icon"
                        })
                      })
                    }, link.url);
                  })
                })
              })]
            })]
          })
        })]
      })
    })]
  });
};

var Menu = function Menu(_ref) {
  var web3ReactInstance = _ref.web3ReactInstance,
    initHidden = _ref.initHidden,
    customLogo = _ref.customLogo,
    _ref$configuredInject = _ref.configuredInjectedConnector,
    configuredInjectedConnector = _ref$configuredInject === void 0 ? defaultInjectedConnector : _ref$configuredInject,
    _ref$configuredWallet = _ref.configuredWalletConnectConnector,
    configuredWalletConnectConnector = _ref$configuredWallet === void 0 ? defaultWalletConnectConnector : _ref$configuredWallet;
  var _useState = React.useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isModalOpen = _useState2[0],
    setIsModalOpen = _useState2[1];
  var toggleModal = function toggleModal() {
    return setIsModalOpen(function (prev) {
      return !prev;
    });
  };
  var account = web3ReactInstance.account;
  var _useAuthorization = useAuthorization(web3ReactInstance, configuredInjectedConnector, configuredWalletConnectConnector),
    loginMetamask = _useAuthorization.loginMetamask,
    loginWalletConnect = _useAuthorization.loginWalletConnect,
    logout = _useAuthorization.logout;
  return /*#__PURE__*/jsxRuntime.exports.jsxs(react.PrismicProvider, {
    client: client,
    children: [/*#__PURE__*/jsxRuntime.exports.jsx(WalletModal, {
      isOpen: isModalOpen,
      loginMetamask: loginMetamask,
      loginWalletConnect: loginWalletConnect,
      toggleModal: toggleModal
    }), /*#__PURE__*/jsxRuntime.exports.jsx(MenuBody, {
      login: toggleModal,
      address: account,
      logout: logout,
      initHidden: initHidden,
      customLogo: customLogo
    })]
  });
};

exports.Menu = Menu;
exports.MetamaskConnectButton = MetamaskConnectButton;
exports.WalletConnectButton = WalletConnectButton;
exports.WalletModal = WalletModal;
exports.allAmbNetworksConfig = allAmbNetworksConfig;
exports.changeChainId = changeChainId;
exports.defaultInjectedConnector = defaultInjectedConnector;
exports.defaultWalletConnectConnector = defaultWalletConnectConnector;
exports.getCurrentAmbNetwork = getCurrentAmbNetwork;
exports.useAuthorization = useAuthorization;
exports.useAutoLogin = useAutoLogin;
