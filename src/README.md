As usual, the Elm code breaks up into a `Model` of the world, a way to `Update`
that model based on input, and a way to `Display` it all. This is all put
together in `Main` which deals with the pointer lock ports.

I experimented with breaking display up into subsections that can share shaders.
For example, if you want to create a skybox by creating a cube with different
colors in the corners, you can probably reuse the shaders from `Display.World`.
If you want to create a skybox with a [cool texture][texture], you can probably
reuse the shaders from the `Display.Crate`.

[texture]: http://www.braynzarsoft.net/vision/texturesamples/Above_The_Sea.jpg 

Perhaps the right thing is to break the shaders out into a module of their own?
Maybe there's a way to create a unit cube where it is easy to augment each
corner with extra attributes? I am curious to see what people end up doing!
