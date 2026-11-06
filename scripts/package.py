"""Package the compiled website and the complete editable project separately."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parents[1]
version = json.loads((root / 'package.json').read_text())['version']
out = root / 'artifacts'
out.mkdir(exist_ok=True)
if not (root / 'dist/index.html').is_file():
    raise SystemExit('Run npm run build first.')

website = out / f'SKYCHROME-v{version}-website.zip'
source = out / f'SKYCHROME-v{version}-source.zip'
with zipfile.ZipFile(website, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for p in sorted((root / 'dist').rglob('*')):
        if p.is_file():
            z.write(p, p.relative_to(root / 'dist'))

excluded = {'.git', 'node_modules', 'dist', 'artifacts', 'test-results'}
with zipfile.ZipFile(source, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for p in sorted(root.rglob('*')):
        rel = p.relative_to(root)
        if p.is_file() and not any(part in excluded for part in rel.parts):
            if p.is_symlink():
                raise ValueError(f'Refusing to package symlink: {rel}')
            z.write(p, Path(f'SKYCHROME-v{version}-source') / rel)

manifest_path = out / 'checksums.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
for p in [website, source]:
    with zipfile.ZipFile(p) as z:
        if z.testzip() is not None:
            raise RuntimeError(f'Archive integrity failure: {p.name}')
        print(f'{p.name}: {len(z.infolist())} files, {p.stat().st_size:,} bytes')
    manifest[p.name] = {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
