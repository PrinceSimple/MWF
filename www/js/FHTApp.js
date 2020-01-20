/**
 * Created by phrunk on 24.11.19
 */
import {mwf} from "./Main.js"
import {mwfUtils} from "./Main.js"
import {EntityManager} from "./Main.js"
import {GenericCRUDImplLocal} from "./Main.js"
import {GenericCRUDImplRemote} from "./Main.js"
import {entities} from "./Main.js"

class FHTApp extends mwf.Application {
    constructor() {
        super();
    }
    async oncreate() {
        Ractive.DEBUG = false;
        console.log("FHTApp.oncreate(): calling supertype oncreate")
        // first call the supertype method and pass a callback
        await super.oncreate();
        console.log("FHTApp.oncreate(): initialising local database")
        // initialise the local database
        // TODO-REPEATED: add new entity types to the array of object store names
        await GenericCRUDImplLocal.initialiseDB("mwftutdb", 1, ["MediaItem"])
        console.log("FHTApp.oncreate(): local database initialised")
        //// TODO-REPEATED: if entity manager is used, register entities and crud operations for the entity types
        this.registerEntity("MediaItem", entities.MediaItem, true);
        this.registerCRUD("MediaItem", this.CRUDOPS.LOCAL, GenericCRUDImplLocal.newInstance("MediaItem"))
        this.registerCRUD("MediaItem", this.CRUDOPS.REMOTE, GenericCRUDImplRemote.newInstance("MediaItem"))

        // activate the local crud operations
        this.initialiseCRUD(this.CRUDOPS.LOCAL, EntityManager)
        // service worker Behelfsimplementierung
        //this.initialiseCacheServiceWorker()
        
        // TODO: do any further application specific initialisations here
        // THIS MUST NOT BE FORGOTTEN: initialise the entity manager!
        EntityManager.initialise()
    }

    initialiseServiceWorkers() {
        console.log("initialiseServiceWorkers()");
        if ('serviceWorker' in navigator) {
            console.log("initialiseServiceWorkers(): adding event handler for messaging...");
            // here, we register for receiving messages from a worker
            navigator.serviceWorker.addEventListener("message", (event) => {
                console.log("received message from serviceWorker: " + event.data);
                // the event contains the port which we will use to return data to the event emitter
                event.ports[0].postMessage({data: this.handleServiceWorkerRequest(event.data)});
            });
            // it seems that service workers need to be physically placed at the root of its scope, otherwise there will be a security exception...
            navigator.serviceWorker.register("../OfflineCacheServiceWorker.js")
                .then(function(reg) {
                    // registration worked
                    console.log('Service Worker Registration succeeded. Scope is ' + reg.scope);
                }).catch(function(error) {
                // registration failed
                console.log('Service Worker Registration failed with ' + error);
                mwfUtils.showToast("Service Worker could not be registered!",1500);
            });
            // this will send a message to the worker
            if (navigator.serviceWorker.controller) {
                console.log("initialiseServiceWorkers(): let service worker cache resources if update is required...");
                navigator.serviceWorker.controller.postMessage({func: "cacheResources"});
            }
            else {
                console.log("initialiseServiceWorkers(): serviceWorker.controller is not available");
            }
        }
        else {
            mwfUtils.showToast("Service Workers are not supported by this browser. Offline cache will not be available.",1500);
        }
    }

    async initialiseCacheServiceWorker() {
        console.log("initialiseCACHEServiceWorker()");
        if ('serviceWorker' in navigator) {
            console.log("initialiseServiceWorkers(): adding event handler for messaging...");
            // here, we register for receiving messages from a worker
            navigator.serviceWorker.addEventListener("message", (event) => {
                console.log("received message from serviceWorker: " + event.data);
                // the event contains the port which we will use to return data to the event emitter
                event.ports[0].postMessage({data: this.handleServiceWorkerRequest(event.data)});
            });
        await navigator.serviceWorker.register("/CacheServiceWorker.js", { updateViaCache: "none" }).then(function(reg) {
                // registration worked
                console.log('Service Worker Registration succeeded. Scope is ' + reg.scope);
            }).catch(function(error) {
            // registration failed
            console.log('Service Worker Registration failed with ' + error);
            alert("Service Worker could not be registered!");
        });
        /* this.swRegistration = await navigator.serviceWorker.register("/CacheServiceWorker.js", { updateViaCache: "none" })
        this.svcw = swRegistration.installing || swRegistration.waiting || swRegistration.active
        navigator.serviceWorker.addEventListener("controllerchange", function onController(){
            svcw = navigator.serviceWorker.controller */
        }
    }

    // this could be done with eval(), but we would need to do some string replacements for handling the linebreaks in offline.manifest
    handleServiceWorkerRequest(request) {
        console.log("handleServiceWorkerRequest(): " + request.func);
        if (request.func == "localStorage.getItem") {
            return localStorage.getItem(request.args[0]);
        }
        else if (request.func == "localStorage.setItem") {
            localStorage.setItem(request.args[0],request.args[1]);
            return;
        }
        else if (request.func == "alert") {
            alert(request.args[0]);
            return;
        }
        else if (request.func == "showToast") {
            mwfUtils.showToast(request.args[0]);
            return;
        }
        else {
            console.error("handleServiceWorkerRequest(): cannot handle: " + request.func);
        }
    }
}

const application = new FHTApp();
export {application as default}


