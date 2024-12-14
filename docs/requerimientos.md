## Requerimientos del Proyecto de Gestión de Finanzas Personales

### **1. Descripción General**
El proyecto consiste en una aplicación para gestionar finanzas personales con un enfoque en la simplicidad, flexibilidad y seguridad. La app permitirá a los usuarios registrar ingresos y egresos, programar transacciones recurrentes, consultar el historial financiero y generar reportes exportables en formatos como CSV y, opcionalmente, PDF.

La API será multiuso y multiusuario. Cada usuario principal (desarrollador o propietario de un frontend) podrá registrarse, obtener un token JWT y manejar su propio conjunto de datos completamente aislado. Adicionalmente, cada usuario principal podrá crear subusuarios que tendrán acceso controlado a su instancia, ofreciendo flexibilidad y escalabilidad para diferentes implementaciones.

---

### **2. Características Principales**

#### **2.1. Gestión de Ingresos**
- Registro de ingresos con detalles como monto, título, descripción, categoría y etiquetas.
- Filtrado por categoría, rango de fechas o etiquetas.
- **Campos requeridos:**
  - `monto`: cantidad ingresada.
  - `título`: concepto del ingreso.
  - `descripción` (opcional): detalle adicional.
  - `categoría`: clasificación del ingreso.
  - `fecha`: fecha del registro.

#### **2.2. Gestión de Egresos**
- Registro de egresos con opciones similares a los ingresos.
- Configuración de egresos únicos o recurrentes.
- Programación de recurrencia por periodos (diario, semanal, mensual, anual).
- Alertas opcionales para egresos recurrentes.

#### **2.3. Transacciones Programadas**
- Programar ingresos y egresos que se ejecuten automáticamente según su periodicidad configurada.
- Configuración de transacciones únicas o recurrentes.
- Posibilidad de editar, cancelar o pausar las transacciones programadas.

#### **2.4. Historial de Transacciones**
- Acceso a un registro detallado de todas las transacciones.
- Filtros avanzados por rango de fechas, categorías, etiquetas o tipo (ingreso/egreso).
- Exportación de registros en formato CSV (y posiblemente PDF).

#### **2.5. Resumen Financiero**
- Mostrar el saldo general basado en los ingresos y egresos registrados.
- Gráficos visuales para analizar los ingresos y egresos por categoría y periodo.
- Tendencias del flujo de capital a lo largo del tiempo.

#### **2.6. Soporte Multiusuario y Multiuso**
**Multiuso:**
- Cada usuario principal (propietario de un frontend) podrá registrarse mediante la API y obtener un token JWT para interactuar exclusivamente con sus datos.
- Los usuarios principales tendrán sus propias instancias de datos, completamente aisladas de otros usuarios principales.

**Multiusuario:**
- Cada usuario principal puede crear **subusuarios** para que interactúen con su instancia de datos.
- Los subusuarios tendrán permisos configurables (lectura, escritura, edición).
- Los datos de cada subusuario estarán aislados dentro del entorno del usuario principal.

**Seguridad:**
- La autenticación y autorización se manejarán mediante JWT para garantizar un acceso seguro y controlado.
- Los tokens serán únicos para cada usuario principal y sus subusuarios.

---

### **3. Características Secundarias u Opcionales**

1. **Multidivisa:**
   - Configuración de una divisa principal.
   - Registro de transacciones en diferentes monedas con conversión automática.
   - Sincronización opcional de tasas de cambio con una API externa.

2. **Gestión de Presupuestos:**
   - Configurar límites de gasto por categorías.
   - Notificaciones al alcanzar ciertos porcentajes del límite (e.g., 80%, 100%).

3. **Informes Financieros:**
   - Generación de reportes periódicos con gráficos y estadísticas.
   - Comparación de ingresos vs. egresos.
   - Exportación en formatos PDF o CSV.

4. **Personalización de Interfaz:**
   - Modo oscuro y claro para mejorar la experiencia del usuario final.

---

### **4. Modelos de Datos Predefinidos**

#### **Modelo: Usuarios**
Esta tabla representa a los desarrolladores o propietarios de un frontend independiente.

| Campo              | Tipo de Dato       | Descripción                                 |
|---------------------|--------------------|---------------------------------------------|
| `id`               | INT AUTO_INCREMENT | Identificador único del usuario principal.  |
| `nombre`           | VARCHAR(100)       | Nombre del desarrollador o propietario.     |
| `correo`           | VARCHAR(255)       | Email único del usuario principal.          |
| `contraseña`       | VARCHAR(255)       | Contraseña cifrada.                         |
| `token`            | VARCHAR(500)       | Token JWT único asociado al usuario.        |
| `creado_en`        | TIMESTAMP          | Fecha de creación del usuario principal.    |

#### **Modelo: Subusuarios**
Esta tabla representa a los usuarios finales dentro de un frontend creado por un usuario principal.

| Campo              | Tipo de Dato       | Descripción                                  |
|---------------------|--------------------|----------------------------------------------|
| `id`               | INT AUTO_INCREMENT | Identificador único del subusuario.          |
| `usuario_principal`| INT                | ID del usuario principal al que pertenece.   |
| `nombre`           | VARCHAR(100)       | Nombre del subusuario.                       |
| `correo`           | VARCHAR(255)       | Email del subusuario (único dentro de la instancia). |
| `contraseña`       | VARCHAR(255)       | Contraseña cifrada del subusuario.           |
| `permisos`         | ENUM('lectura', 'escritura', 'edición') | Permisos asignados. |
| `creado_en`        | TIMESTAMP          | Fecha de creación del subusuario.            |

#### **Modelo: Transacciones**
Esta tabla registra todas las transacciones (ingresos y egresos).

| Campo              | Tipo de Dato       | Descripción                                  |
|---------------------|--------------------|----------------------------------------------|
| `id`               | INT AUTO_INCREMENT | Identificador único de la transacción.       |
| `usuario_principal`| INT                | ID del usuario principal asociado.           |
| `subusuario_id`    | INT                | ID del subusuario que realizó la transacción (opcional). |
| `tipo`             | ENUM('ingreso', 'egreso') | Tipo de transacción.                    |
| `monto`            | DECIMAL(10, 2)     | Cantidad monetaria.                          |
| `título`           | VARCHAR(255)       | Concepto o título de la transacción.         |
| `descripción`      | TEXT               | Descripción detallada (opcional).            |
| `fecha`            | DATETIME           | Fecha de la transacción.                     |
| `categoría`        | VARCHAR(100)       | Categoría asignada.                          |
| `etiquetas`        | VARCHAR(255)       | Etiquetas personalizadas separadas por comas.|
| `recurrente`       | BOOLEAN            | Indica si es recurrente.                     |
| `frecuencia`       | ENUM('diaria', 'semanal', 'mensual', 'anual') | Periodicidad.  |
| `creado_en`        | TIMESTAMP          | Fecha de creación del registro.              |

---

### **5. Tecnologías a Usar**

#### **Frontend:**
- **Vue.js:** Framework progresivo para construir interfaces dinámicas y reactivas.
- **Tailwind CSS:** Framework CSS para diseño ágil y moderno.

#### **Backend:**
- **Node.js y Express:** Backend flexible para crear una API RESTful.
- **JWT (JSON Web Tokens):** Seguridad para autenticación y autorización.
- **MySQL:** Base de datos relacional para manejo estructurado de datos.
- **ORM:** Sequelize o TypeORM (pendiente de definición).

#### **Extras:**
- **CSV y PDF:** Exportación de datos para reportes.
- **Postman:** Documentación y pruebas de la API.
- **Docker:** Contenedores para ambientes consistentes.
- **Jest:** Pruebas unitarias.

---

Este análisis final detalla una base sólida para comenzar el desarrollo de la aplicación y establecer un marco claro para la API y sus funcionalidades.

