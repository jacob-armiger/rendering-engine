## Hosted At
https://web.eecs.utk.edu/~jarmiger/dynamic-degree/

## Compatibility

Check if your browser is usable here:

https://get.webgl.org/webgl2/

## Serving

These files can be ran locally so that you may test without pinging the hydra machine (so you can work offline, or in the event Hydra is powered off). You must run from a browser compatible with WebGL2 and a computer made in the last half century.

If you have python3 installed:

```
cd ~/dir/containing/index_file
python3 -m http.server 5000
```

If you have npm installed (recommended)

1) Install serve (it is a global install, be warned!)
2) serve the dir

```
npm i -g serve
cd ~/starter/code/dir/containing/index_file
serve
```

### I have tried to do X but the program is slow. What is the deal?

Right now, we are not utilizing a key feature of WebGL2 - the vertex array object.
At every render call for a drawable object the starter code must rebind all buffers.
This is expensive, and can be fixed with a vertex array object.
Read more here: https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
On top of this, you are probably utilizing the `getFlattened` method from the obj loader.
This function creates massive buffers compared to an indexed buffer (read more here: https://webglfundamentals.org/webgl/lessons/webgl-indexed-vertices.html ).
To speed up your code if you are hitting bottlenecks I would encourage you to investigate Indexed Buffers as well as Vertex Array Objects.
