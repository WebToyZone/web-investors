# Especificación Técnica — Página Investors (EOLO)

> Documento de análisis y guía de desarrollo. Basado en el diseño actual de la página de inversores de EOLO. No incluye código; define estructura, sistema de diseño, espaciados, tipografía, patrones y componentes.

---

## 1. Estructura general

Página de aterrizaje vertical de scroll único (one-pager) orientada a inversores, con navegación por anclas. La narrativa va de **marca → crecimiento → modelo → datos → gobierno → emocional → documentos → contacto**.

Orden de secciones (de arriba a abajo):

| # | Sección | ID ancla (nav) | Fondo | Contenedor |
|---|---------|----------------|-------|------------|
| 0 | **Header / Navbar** (sticky) | — | Blanco | Full-width |
| 1 | **Hero** (imagen full-bleed: niño + cometa) | — | Imagen | Full-bleed, sin texto |
| 2 | **Growth Journey 2020–2025** (texto + gráfico de barras + timeline) | `Growth Journey` | Blanco | Centrado, máx. ~1200px |
| 3 | **Unique Business Model** (4 columnas) | `Business Model` | Gris claro `#EFEFEF` | Centrado |
| 3b | **Banda imagen** (cabina/dashboard rojo, full-bleed) | — | Imagen | Full-bleed separador |
| 4 | **Eolo at a Glance 2025** (8 KPIs + 3 plataformas) | `Eolo at a Glance` | Blanco | Centrado |
| 5 | **Board of Directors** (5 + 3 miembros) | `Board of Directors` | Gris claro `#EFEFEF` | Centrado |
| 6 | **The Power of a Smile** (banner emocional full-bleed) | — | Rojo `#C8002D` + imagen | Full-bleed |
| 7 | **Documents** (3 columnas de descargas) | `Documents` | Blanco | Centrado |
| 8 | **We are here to help** (contacto + formulario) | `Contacts` | Blanco | Dos columnas |
| 9 | **Footer** | — | Rojo `#C8002D` | Full-width |

**Ritmo visual:** se alternan fondos blanco / gris claro, y se insertan dos **bandas de imagen full-bleed** (cabina roja, banner "Smile") como separadores emocionales entre bloques densos en datos. Solo dos colores de fondo en todo el documento (blanco + gris claro), más el rojo de marca en hero/footer/banner.

---

## 2. Sistema de diseño

### 2.1 Paleta de color

| Token | Valor | Uso |
|-------|-------|-----|
| `--brand-red` | `#C8002D` | Color primario: logo, títulos, cifras, botones, footer, acentos |
| `--brand-red-bright` | `~#E8203F` | Variante luminosa para degradados de la cometa / detalles |
| `--ink` | `~#1A1A1A` | Texto de títulos en negro (segunda palabra de los headings) |
| `--text-body` | `~#333333` | Cuerpo de texto |
| `--text-muted` | `~#777777` | Subtítulos, metadatos (fechas, "PDF · 8.4 MB") |
| `--bg-white` | `#FFFFFF` | Fondo principal |
| `--bg-gray` | `~#EFEFEF` | Fondo de secciones alternas (Business Model, Board) |
| `--card-border` | `~#E5E5E5` | Bordes de tarjetas KPI y campos de formulario |
| `--footer-red` | `#C8002D` | Fondo del footer y banner emocional |

Color de marca dominante: **rojo carmín `#C8002D`**. Es prácticamente el único color saturado; todo lo demás es neutro (blancos, grises, negro tinta). No hay colores secundarios de acento — la jerarquía se construye solo con rojo vs. negro vs. gris.

### 2.2 Tono visual

- Estética corporativa limpia con un giro lúdico (marca de juguetes): tipografía de titulares pesada y condensada, fotografía 3D estilizada con paleta cálida/roja.
- Las imágenes (hero, cabina, banner) aportan toda la emoción; las secciones de contenido son sobrias y centradas.

---

## 3. Tipografía

Dos familias, ambas sans-serif:

### 3.1 Titulares — sans condensada pesada (estilo *Oswald / Anton / League Gothic*)
- **Uso:** títulos de sección, cifras KPI, nombres del logo.
- **Peso:** Bold / Black (700–900).
- **Transformación:** `UPPERCASE` en todos los títulos de sección, con `letter-spacing` ligeramente positivo.
- **Patrón bicolor:** primera palabra en **rojo**, resto en **negro** — p. ej. *"**UNIQUE** BUSINESS MODEL"*, *"**EOLO** AT A GLANCE 2025"*, *"BOARD OF **DIRECTORS**"*, *"**GROWTH** JOURNEY 2020—2025"*.

### 3.2 Cuerpo — sans humanista/geométrica regular (estilo *Poppins / Mulish / Hind*)
- **Uso:** párrafos, descripciones, etiquetas de tarjeta, nav, formulario.
- **Pesos:** Regular (400) cuerpo, SemiBold (600) para labels y nombres de directivos.

### 3.3 Escala tipográfica (aprox., en viewport desktop ~1366px)

| Rol | Tamaño | Peso | Color |
|-----|--------|------|-------|
| Título de sección (H2) | 40–48px | 800 | rojo + negro |
| Cifra KPI grande (`$19,75M`, `~50 years`) | 32–40px | 800 | rojo |
| Subtítulo de sección | 18–20px | 400 | gris medio, centrado |
| Título de columna (Asset-Light, FOB China…) | 22–24px | 700 | rojo |
| Nombre directivo | 18px | 700 | rojo |
| Cargo directivo | 14px | 600 | negro |
| Cuerpo / descripción | 15–16px | 400 | gris oscuro, `line-height ~1.5` |
| Etiqueta KPI ("Toy Industry Experience") | 14px | 600 | negro |
| Metadato / footer legal | 12–13px | 400 | gris / blanco translúcido |
| Nav items | 16px | 700 | rojo |

### 3.4 Detalle de remate de título
Cada título de sección lleva un **subrayado corto rojo** centrado debajo (≈60px de ancho, 3px de alto), separado ~16px del título.

---

## 4. Espaciados y layout

### 4.1 Rejilla
- **Ancho de contenido:** contenedor centrado de **~1140–1200px** máx., con márgenes laterales fluidos.
- **Secciones full-bleed:** hero, banda de cabina y banner "Smile" ocupan el 100% del ancho de viewport.

### 4.2 Espaciado vertical (ritmo)
- **Padding vertical de sección:** ~80–100px arriba y abajo en secciones de contenido.
- **Título → subtítulo:** ~16–24px.
- **Subtítulo → contenido:** ~48–64px.
- **Entre tarjetas/columnas (gap):** 24–32px.

### 4.3 Sistemas de columnas usados
- **Business Model:** 4 columnas iguales, separadas por **divisores verticales** finos (line de 1px gris).
- **KPI Glance:** rejilla de **4 columnas × 2 filas** (8 tarjetas).
- **Global Operating Platform:** 3 columnas (España / Hong Kong-China / USA) con icono circular.
- **Board of Directors:** fila de **5** (consejo) + fila de **3** (TBC) centradas.
- **Documents:** 3 columnas (Financial Information / Meetings & Notices / Investors Documents).
- **Contacto:** 2 columnas (info izquierda + formulario derecha).

### 4.4 Escala recomendada (tokens de espaciado)
`4 / 8 / 16 / 24 / 32 / 48 / 64 / 80 / 96 px` — múltiplos de 8 como base.

---

## 5. Patrones repetidos

1. **Encabezado de sección bicolor + subrayado rojo + subtítulo centrado.** Se repite en las 5 secciones de contenido. *Candidato a componente.*
2. **Tarjeta KPI:** icono 3D a la izquierda + cifra roja grande + etiqueta debajo, dentro de tarjeta blanca con borde sutil y esquinas redondeadas (~12px). Se repite 8 veces.
3. **Columna de feature con título rojo + descripción** (Business Model). 4 repeticiones con divisor vertical.
4. **Tarjeta de persona:** retrato circular + nombre rojo + cargo + descripción corta centrada. Se repite 5 (board) + 3 (TBC). Variante "TBC" usa un icono ilustrado rojo en lugar de foto.
5. **Item de timeline:** punto rojo (bullet) + título de año en rojo + descripción, conectados por línea vertical. 5 hitos (2020–2024).
6. **Item de documento descargable:** icono PDF + título + metadato (fecha · formato · tamaño) + icono de descarga a la derecha. Bajo un selector de año (`2026`).
7. **Iconos 3D rojos/grises** como recurso ilustrativo recurrente (reloj de arena, billetes, globo, tienda, etc.). Estilo consistente: renders 3D con acentos rojos.
8. **Bandas de imagen full-bleed** como separadores entre secciones.

---

## 6. Componentes reutilizables (propuesta para desarrollo)

> Cada componente debe aceptar props/datos; el contenido NO debe hardcodearse.

| Componente | Props principales | Reutilizado en |
|-----------|-------------------|----------------|
| `SectionHeader` | `firstWord`, `restWords`, `subtitle`, `align` | Las 5 secciones de contenido |
| `Navbar` | `links[]`, `logo`, `sticky` | Header |
| `HeroImage` / `ImageBand` | `src`, `alt`, `height`, `overlayText?` | Hero, banda cabina, banner Smile |
| `RevenueBarChart` | `data[{year, value}]`, `caption` | Growth Journey |
| `TimelineItem` / `Timeline` | `items[{year, title, body}]` | Growth Journey |
| `FeatureColumn` | `title`, `body` (+ divisor) | Business Model (×4) |
| `KpiCard` | `icon`, `value`, `label` | Glance (×8) |
| `PlatformItem` | `icon`, `country`, `description` | Global Operating Platform (×3) |
| `PersonCard` | `photo`/`icon`, `name`, `role`, `bio`, `variant` (`board`/`tbc`) | Board (×8) |
| `DocumentColumn` | `title`, `yearTabs[]`, `documents[{title, date, format, size, url}]` | Documents (×3) |
| `DocumentItem` | `title`, `meta`, `downloadUrl` | dentro de DocumentColumn |
| `ContactForm` | `fields[]`, `consentLabel`, `submitLabel`, `onSubmit` | Contacto |
| `ContactInfo` | `email`, `phone`, `address`, `intro` | Contacto |
| `Footer` | `columns[]`, `social[]`, `legalLinks[]`, `copyright` | Footer |
| `Button` | `label`, `variant` (sólido rojo), `onClick` | "Send it!" (+ futuros CTAs) |

### Notas de comportamiento
- **Navbar sticky** con scroll suave a anclas; el item activo debería resaltarse.
- **Formulario de contacto:** campos *Name and Lastname\**, *Phone\**, *Email\**, *Message\**, checkbox de consentimiento (*Terms & Conditions*) obligatorio, botón "Send it!" en rojo sólido. Requiere validación cliente + protección anti-spam.
- **Documentos:** estructura preparada para múltiples años (tabs/selector `2026`) y múltiples ficheros por columna; enlazan a PDFs reales.
- **Imágenes:** servir responsive (`srcset`), `loading="lazy"` en las que están bajo el fold, y `object-fit: cover` en las bandas full-bleed.

---

## 7. Responsive (recomendaciones)

| Sección | Desktop | Tablet | Móvil |
|---------|---------|--------|-------|
| Nav | horizontal | horizontal/colapsado | menú hamburguesa |
| Business Model | 4 col | 2 col | 1 col (sin divisores verticales) |
| KPI Glance | 4×2 | 2×4 | 1 col |
| Platform | 3 col | 3 col | 1 col |
| Board (5) | 5 col | 3 col | 2 col |
| Documents | 3 col | 1 col apiladas | 1 col |
| Contacto | 2 col | 1 col | 1 col |

Titulares: reducir de 40–48px a ~28–32px en móvil; mantener el patrón bicolor.

---

## 8. Accesibilidad y técnica

- **Contraste:** rojo `#C8002D` sobre blanco cumple AA para texto grande; verificar el texto rojo pequeño (cargos, metadatos) — preferir negro para cuerpo.
- **Textos alternativos** en todas las imágenes 3D e iconos.
- **Jerarquía semántica:** un único `<h1>` (marca/hero), `<h2>` por sección, `<h3>` en columnas.
- **Formulario:** labels asociados, estados de error visibles, foco visible.
- **Rendimiento:** las imágenes 3D son pesadas — optimizar (WebP/AVIF), las bandas full-bleed son las de mayor coste.

---

## 9. Resumen ejecutivo

Página one-pager para inversores, **monocromática roja sobre neutros**, con una retícula centrada de ~1140px y bandas de imagen full-bleed como respiros emocionales. El sistema se sostiene sobre **dos familias tipográficas** (titular condensado pesado + cuerpo geométrico), un **patrón de título bicolor con subrayado rojo**, y un set acotado de **~15 componentes reutilizables** centrados en tarjetas (KPI, persona, documento) y columnas de feature. Para desarrollo: priorizar `SectionHeader`, `KpiCard`, `PersonCard` y `DocumentColumn` por ser los más repetidos, y construir todo guiado por datos para escalar años/documentos sin tocar maquetación.
