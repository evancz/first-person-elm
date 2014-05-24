(function() {

Elm.embedWithPointerLock = function(module, div, args) {
    var component = Elm.embed(module, div, initArgs(args));
    return setup(component, div);
}

Elm.fullscreenWithPointerLock = function(module, args) {
    var component = Elm.fullscreen(module, initArgs(args));
    return setup(component, document.body);
}

document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

function initArgs(args) {
    args = args || {};
    args.movement = [0,0];
    args.isLocked = false;
    return args;
}

function isLocked(node) {
    return (   node === document.pointerLockElement
            || node === document.mozPointerLockElement
            || node === document.webkitPointerLockElement);
}

function isFullscreen(node) {
    return document.webkitFullscreenElement === node ||
           document.mozFullscreenElement === node ||
           document.mozFullScreenElement === node;
}

function setup(component, node) {
    function request() {
        node.requestFullscreen = node.requestFullscreen    ||
                                 node.mozRequestFullscreen ||
                                 node.mozRequestFullScreen || // Older API upper case 'S'.
                                 node.webkitRequestFullscreen;
        node.requestFullscreen();
    }

    document.addEventListener('fullscreenchange', fullscreenChange, false);
    document.addEventListener('mozfullscreenchange', fullscreenChange, false);
    document.addEventListener('webkitfullscreenchange', fullscreenChange, false);

    function fullscreenChange() {
        if (isFullscreen(node)) {
            node.requestPointerLock = node.requestPointerLock    ||
                                      node.mozRequestPointerLock ||
                                      node.webkitRequestPointerLock;
            node.requestPointerLock();
        }
    }

    document.addEventListener('pointerlockchange', pointerLockChange, false);
    document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

    function pointerLockChange() {
        if (isLocked(node)) {
            node.addEventListener('mousemove', move);
            component.ports.isLocked.send(true);
        } else {
            node.removeEventListener('mousemove', move);
            component.ports.isLocked.send(false);
        }
    }

    function move(e) {
        var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
        component.ports.movement.send([movementX, movementY]);
    }


    function exit() {
        document.exitPointerLock();
    }

    if (component.ports.requestPointerLock) {
        component.ports.requestPointerLock.subscribe(request);
    }
    if (component.ports.exitPointerLock) {
        component.ports.exitPointerLock.subscribe(exit);
    }

    component.requestPointerLock = request;
    component.exitPointerLock = exit;

    return component;
}

}())
