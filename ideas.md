# BELENTANI // JUDAS — Dirección creativa

## Tres rutas estilísticas consideradas

### Enfoque 01 — Dark Cosmic Luxury
**Very Brief Intro:** Un universo nocturno, editorial y sensorial donde el rojo rubí parece vivir dentro de objetos de obsidiana, cristal oscuro y geometrías suspendidas. La experiencia se siente como una instalación de arte contemporáneo que se abre lentamente ante el visitante.

**Probability:** 0.087

### Enfoque 02 — Concrete Poetry
**Very Brief Intro:** Una dirección brutalista-editorial construida con blanco roto, carbón, tipografía monumental y cortes de composición asimétricos. Menos mística y más física: el sitio funciona como un manifiesto de artista impreso en movimiento.

**Probability:** 0.031

### Enfoque 03 — Chromatic Ritual
**Very Brief Intro:** Una experiencia de museo digital con superficies marfil, pigmento carmín, fotografías de estudio y transiciones suaves como páginas de un libro de arte. El misterio nace del contraste entre pureza visual y mensajes inquietantes.

**Probability:** 0.064

## Enfoque elegido — Dark Cosmic Luxury

### Design Movement
Dark Cosmic Luxury: una síntesis de editorial de alta moda, arte digital contemporáneo, fotografía cinematográfica de baja luz y joyería escultórica. La tecnología existe, pero se percibe como un artefacto ritual y orgánico, nunca como un panel hacker o una interfaz gamer.

### Core Principles
1. **El rojo nace desde dentro.** El rubí funciona como energía interna en vez de neón aplicado por encima.
2. **La interfaz es un umbral.** Cada sección debe parecer una cámara de la obra, con entrada, pausa, revelación y salida.
3. **La geometría organiza el misterio.** Círculos, diamantes, órbitas, grietas y líneas finas unen música, historia e identidad.
4. **La tensión vive en el espacio.** Mucho vacío, tipografía precisa y momentos de intensidad controlada sustituyen el ruido visual.

### Color Philosophy
El lienzo es **Black Void** (#050506), un negro cálido y profundo que permite que el contenido parezca emerger de la oscuridad. **Obsidian** (#111113) y **Smoke Glass** (#1b1a1c) construyen capas táctiles sin recurrir a tarjetas genéricas. El color propio de la marca es **Belentani Ruby** (#b51232): un rojo mineral, denso y adulto, utilizado como señal de vida, memoria, peligro y deseo. Los blancos son hueso y ceniza (#f0ece7, #aaa4a0), nunca blanco clínico.

### Layout Paradigm
La estructura es una **secuencia vertical cinematográfica** con un eje central desplazado, riel lateral de navegación y objetos que atraviesan el flujo. La portada alterna un hero asimétrico, un campo orbital, un archivo musical, un manifiesto y una zona de entrada. Se evita la retícula uniforme: los bloques tienen anchuras, márgenes y alineaciones diferentes para crear sensación de montaje.

### Signature Elements
- Una **órbita ruby** con nodos geométricos que responde al puntero y conecta las cinco dimensiones de Judas.
- **Diamantes de vidrio oscuro**, facetados con CSS y reflejos interiores rubí, que funcionan como objetos vivos y seleccionables.
- **Etiquetas de sistema editorial** (código, coordenadas, estado, frecuencia) con líneas finas y microanimaciones, como las notas de conservación de una pieza de museo.

### Interaction Philosophy
Las interacciones deben sentirse como descubrimientos, no como controles de aplicación. El hover revela profundidad, latencia y una segunda capa de texto; el click abre una cámara o fija una elección. Las acciones importantes tienen una respuesta sonora sugerida visualmente mediante pulsos, ondas y cambios de densidad. Siempre existe una salida clara hacia el índice y el contenido musical.

### Animation
Las entradas utilizan desplazamientos cortos, opacidad y desenfoque que se resuelven con una curva de salida marcada; nunca hay rebotes elásticos. Las órbitas tienen movimiento lento y casi gravitacional. Los diamantes hacen un parallax sutil al mover el cursor y un pulso interno cada pocos segundos. El hero mantiene un movimiento ambiental mínimo (grano, estrellas, respiración del rubí) para no competir con el texto. Las animaciones se desactivan o simplifican con `prefers-reduced-motion`.

### Typography System
- **Display:** Cormorant Garamond, con serif de alto contraste para titulares, frases de revelación y palabras como JUDAS.
- **Interface:** Space Mono para códigos, estados, navegación, frecuencias y metadatos.
- **Body:** DM Sans para lectura continua y CTAs.

Jerarquía: titulares display entre 76–156 px en desktop y 58–84 px en móvil; eyebrow mono de 10–11 px con tracking de 0.22em; cuerpo de 15–18 px y ancho corto; CTAs en mono uppercase de 11–12 px.

### Brand Essence
**Posicionamiento:** Belentani crea música, imágenes y experiencias para quienes no buscan una respuesta cómoda, sino una puerta hacia una versión más honesta de sí mismos.

**Personalidad:** magnético, provocador, vulnerable.

### Brand Voice
Los titulares suenan como fragmentos de una obra: breves, seguros y ligeramente inquietantes. Los CTAs son invitaciones rituales, nunca frases de producto. El microcopy es preciso, humano y con una pizca de misterio.

- “The next chapter is not waiting. It is looking back.”
- “Enter the portal. Leave with a different name.”

### Wordmark & Logo
El wordmark se mantiene tipográfico y espaciado, con **BELENTANI** en mayúsculas, pero la marca gráfica no depende del texto: un diamante incompleto atravesado por una grieta vertical, con un núcleo ruby desplazado hacia abajo. El símbolo se usa en cabecera, favicon y como cursor/insignia dentro del portal.

### Signature Brand Color
**Belentani Ruby — #B51232.** Un rojo oscuro y mineral, suficientemente distintivo para ser propio y suficientemente sobrio para no caer en estética cyberpunk.

## Decisiones de implementación

La primera entrega será una single-page experience en inglés, porque la versión existente ya fue traducida y el contenido actual indica que Judas es el próximo lanzamiento, no una “era” separada. Se conservarán los conceptos Belentani, Music, Studio, Judas, Portal, About, Contact, newsletter, JudasChat y la biografía, pero se reorganizarán en una experiencia coherente: **Arrival → The Portal → Five Diamonds → The Sound → The Artist → Transmission**.

Las funcionalidades principales serán reales en frontend: navegación por anclas, menú responsive, modo de inmersión para el portal, selección de diamantes, chat visual simulado con estados de escritura, newsletter con confirmación local y reproducción visual de una pista mediante un reproductor de demo sin prometer audio inexistente. No se inventarán reseñas, ratings ni testimonios.
