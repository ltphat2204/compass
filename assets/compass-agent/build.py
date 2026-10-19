"""Run with Blender --background --python build.py. No external assets needed."""
import math
from pathlib import Path
import bpy

OUT = Path(__file__).resolve().parent
NAVY, RED, WHITE, MUTED = '#0f172a', '#dc2626', '#f8fafc', '#94a3b8'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'Standard'
scene.world.color = (1, 1, 1)


def material(color):
    mat = bpy.data.materials.get(color) or bpy.data.materials.new(color)
    mat.diffuse_color = (*[int(color[i:i+2], 16) / 255 for i in (1, 3, 5)], 1)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    rgb = mat.diffuse_color[:3]
    emission.inputs['Color'].default_value = (*[(c/12.92 if c <= .04045 else ((c+.055)/1.055)**2.4) for c in rgb], 1)
    mat.node_tree.links.new(emission.outputs[0], out.inputs['Surface'])
    return mat


def polygon(name, points, color, origin=(0, 0), scale=1, z=0):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(origin[0]+x*scale, origin[1]+y*scale, z) for x, y in points], [], [list(range(len(points)))])
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    obj.data.materials.append(material(color))
    return obj


def circle(cx, cy, r):
    return [(cx+r*math.cos(i*math.tau/64), cy+r*math.sin(i*math.tau/64)) for i in range(64)]


# The open ring becomes C; its northeast opening is also the destination.
angles = [math.radians(76+i*298/160) for i in range(161)]
ring = [(math.cos(a), math.sin(a)) for a in angles]
ring += [(.82*math.cos(a), .82*math.sin(a)) for a in reversed(angles)]
# A terminal > rotated northeast reads as the compass needle's arrowhead.
chevron = [(-.15, .61), (.77, .77), (.61, -.15), (.35, .11), (.41, .41), (.11, .35)]
eyes = [circle(-.31, -.14, .065), circle(-.05, -.14, .065)]
assert len(ring) == 322 and len(chevron) == 6
assert all(-1.01 <= c <= 1.01 for shape in [ring, chevron, *eyes] for pt in shape for c in pt)


def mark(origin=(0, 0), scale=1, ink=NAVY):
    polygon('Compass C / guidance', ring, ink, origin, scale)
    polygon('Code chevron / northeast needle', chevron, RED, origin, scale, .02)
    for i, eye in enumerate(eyes):
        polygon('Agent eye '+str(i+1), eye, ink, origin, scale, .02)


def camera(x, y, width, resolution):
    if not scene.camera:
        data = bpy.data.cameras.new('Orthographic camera')
        obj = bpy.data.objects.new('Orthographic camera', data)
        scene.collection.objects.link(obj)
        scene.camera = obj
    scene.camera.location = (x, y, 10)
    scene.camera.rotation_euler = (0, 0, 0)
    scene.camera.data.type = 'ORTHO'
    scene.camera.data.ortho_scale = width
    scene.render.resolution_x, scene.render.resolution_y = resolution
    scene.render.resolution_percentage = 100


def render(filename):
    scene.render.filepath = str(OUT / filename)
    bpy.ops.render.render(write_still=True)


mark()
camera(0, 0, 2.55, (1024, 1024))
scene.render.film_transparent = True
render('compass-agent.png')
camera(0, 0, 2.55, (32, 32))
render('compass-agent-32.png')

# SVG uses exactly the same sampled silhouettes as the Blender meshes.
def svg_path(points):
    return 'M'+' L'.join(f'{64+x*48:.3f},{64-y*48:.3f}' for x, y in points)+' Z'

svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Compass: guiding software agents">\n'
for points, color in [(ring, NAVY), (chevron, RED), *[(e, NAVY) for e in eyes]]:
    svg += f'  <path fill="{color}" d="{svg_path(points)}"/>\n'
(OUT/'compass-agent.svg').write_text(svg+'</svg>\n')

for obj in list(bpy.data.objects):
    if obj != scene.camera:
        bpy.data.objects.remove(obj, do_unlink=True)

font = bpy.data.fonts.load('/System/Library/Fonts/Supplemental/Arial.ttf')
bold = bpy.data.fonts.load('/System/Library/Fonts/Supplemental/Arial Bold.ttf')


def text(body, x, y, size, color, heavy=False, spacing=1):
    curve = bpy.data.curves.new(body, 'FONT')
    curve.body, curve.size = body, size
    curve.font = bold if heavy else font
    curve.space_character = spacing
    obj = bpy.data.objects.new(body, curve)
    scene.collection.objects.link(obj)
    obj.location = (x, y, .05)
    curve.materials.append(material(color))


polygon('Light background', [(-6,-3.5),(0,-3.5),(0,3.5),(-6,3.5)], WHITE, z=-.1)
polygon('Dark background', [(0,-3.5),(6,-3.5),(6,3.5),(0,3.5)], NAVY, z=-.1)
for cx, ink in [(-3, NAVY), (3, WHITE)]:
    mark((cx, .6), 1.25, ink)
    text('compass', cx-1.48, -1.55, .78, ink, True)
    text('GUIDING SOFTWARE AGENTS', cx-1.47, -2.12, .155, MUTED, spacing=1.15)
    text('C / COMPASS     > / CODE     .. / AGENT', cx-2.25, 2.73, .135, MUTED)
camera(0, 0, 12, (1800, 1050))
scene.render.film_transparent = False
render('preview.png')
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'compass-agent.blend'))
assert all((OUT/name).stat().st_size > 100 for name in ['compass-agent.png', 'compass-agent-32.png', 'compass-agent.svg', 'preview.png', 'compass-agent.blend'])
print('PASS: Blender scene, PNG renders, SVG and geometry checks')
