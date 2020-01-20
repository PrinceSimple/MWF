var version = 8;
var isOnline = true;
var isLoggedIn = false;
var cacheName = `trojanowski-${version}`;

var urlsToCache = {
	loggedOut: [
		"/app.html",
        "/content/img/videocontent.png",
        "/content/img/videocontent_bw.png",
        "/css/FHT.css",
        "/js/controller/ListViewController.js",
        "/js/controller/MediaEditViewController.js",
        "/js/controller/MyInitialViewController.js",
        "/js/controller/ReadViewController.js",
        "/js/controller/ViewControllerTemplate.js",
        "/js/FHTApp.js",
        "/js/Main.js",
        "/js/model/Entities.js",
        "/lib/css/img/glyphicons/png/glyphicons-433-plus.png",
        "/lib/css/img/glyphicons/png/glyphicons-518-option-vertical.png",
        "/lib/css/img/glyphicons/png/glyphicons-82-refresh.png",
        "/lib/css/img/glyphicons/png/glyphicons-17-bin.png",
        "/lib/css/img/glyphicons/png/glyphicons-31-pencil.png",
        "/lib/css/img/glyphicons/png/glyphicons-211-arrow-left.png",
        "/lib/css/img/glyphicons/png/glyphicons-444-floppy-disk.png",
        "/lib/css/img/glyphicons/png/glyphicons-517-menu-hamburger.png",
        "/lib/css/mwf.css",
        "/lib/css/mwfIcons.css",
        "/lib/css/normalize.css",
        "/lib/js/external/ractive.min.js",
        "/lib/js/external/ractive.min.js.map",
        "/lib/js/external/require.js",
        "/lib/js/framework-modules.js",
        "/lib/js/mwf/controller/mwfGenericDialogTemplateViewController.js",
        "/lib/js/mwf/controller/mwfMapHolderLeaflet.js",
        "/lib/js/mwf/crud/mwfEntityManager.js",
        "/lib/js/mwf/crud/mwfGenericCRUDImplLocal.js",
        "/lib/js/mwf/crud/mwfGenericCRUDImplRemote.js",
        "/lib/js/mwf/crud/mwfIndexeddb.js",
        "/lib/js/mwf/crud/mwfXhr.js",
        "/lib/js/mwf/mwf.js",
        "/lib/js/mwf/mwfEventhandling.js",
        "/lib/js/mwf/mwfUtils.js",
        "/offline.manifest",
        "/OfflineCacheServiceWorker.js",
        "/pwa/mipmap-hdpi/launcher-icon.png",
        "/pwa/mipmap-mdpi/launcher-icon.png",
        "/pwa/mipmap-xhdpi/launcher-icon.png",
        "/pwa/mipmap-xxhdpi/launcher-icon.png",
        "/pwa/mipmap-xxxhdpi/launcher-icon.png",
        "/pwa/offline.png",
        "/pwa/webapp-manifest.json"
	]
};
self.addEventListener("install", onInstall)
self.addEventListener("activate", onActivate)

main().catch(console.error)


async function main() {
    console.log(`Cache Service Worker V${version} is starting...`)
	await cacheLoggedOutFiles();
}

function onInstall(e){
    console.log(`Cache Service Worker V${version} is installing...`)
    self.skipWaiting()
}
function onActivate(e){
    console.log(`Cache Service Worker V${version} is activating...`)
    e.waitUntil(handleActivation())
}
async function handleActivation() {
	await clearCaches();
	await cacheLoggedOutFiles(true);
	await clients.claim();
	console.log(`CAche Service Worker V${version}) activated`);
}
async function clearCaches() {
	var cacheNames = await caches.keys();
	var oldCacheNames = cacheNames.filter(function matchOldCache(cacheName){
		var [,cacheNameVersion] = cacheName.match(/^ramblings-(\d+)$/) || [];
		cacheNameVersion = cacheNameVersion != null ? Number(cacheNameVersion) : cacheNameVersion;
		return (
			cacheNameVersion > 0 &&
			version !== cacheNameVersion
		);
	});
	await Promise.all(
		oldCacheNames.map(function deleteCache(cacheName){
			return caches.delete(cacheName);
		})
	);
}

async function cacheLoggedOutFiles(forceReload = false) {
	const cache = await caches.open(cacheName);
	return Promise.all(
		urlsToCache.loggedOut.map(async function requestFile(url){
			try {
				let res;
				if (!forceReload) {
					res = await cache.match(url);
					if (res) {
						return;
					}
				}
				let fetchOptions = {
					method: "GET",
					cache: "no-store",
					credentials: "omit"
				};
				res = await fetch(url,fetchOptions);
				if (res.ok) {
					return cache.put(url,res);
				}
			}
			catch (err) {}
		})
	);
}

function notFoundResponse() {
	return new Response("",{
		status: 404,
		statusText: "Not Found"
	});
}

function delay(ms) {
	return new Promise(function c(res){
		setTimeout(res,ms);
	});