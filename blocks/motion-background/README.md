# Motion Background Block

The motion background block was an experiment in providing a wrapper WebGL context for blocks because each browser implementation has a fixed number of WebGL contexts available.

It proved a bit more difficult than was worth continuing to explore since it was unlikely to have more than 8 of these blocks on a single page. So the idea was discarded and development continued in the [`a8c/waves` block](/blocks/waves) using a single WebGL context for each block.
