drop table if exists entrada_trx;
drop table if exists envio_email;
drop table if exists error;
drop table if exists historia_academica;
drop table if exists periodo;
drop table if exists cursada;
drop table if exists comision;
drop table if exists correlatividad;
drop table if exists materia;
drop table if exists alumne;
drop sequence if exists secuencia_error;

create table alumne (
	id_alumne int,
	nombre text,
	apellido text,
	dni int,
	fecha_nacimiento date,
	telefono char(12),
	email text -- válido
);

create table materia (
	id_materia int,
	nombre text
);

create table correlatividad (
	id_materia int,
	id_mat_correlativa int
);

create table comision (
	id_materia int,
	id_comision int, -- 1, 2, 3,... por cada materia
	cupo int -- máxima cantidad de alumnes que pueden cursar
);

create table cursada (
	id_materia int,
	id_alumne int,
	id_comision int,
	f_inscripcion timestamp,
	nota int, -- inicialmente en null: no hay nota
	estado char(12) -- `ingresade',`aceptade',`en espera',`dade de baja'
);

create table periodo (
	semestre text, -- ejemplo: `2024-1'
	estado char(14) -- `inscripcion',`cierre inscrip',`cursada',`cerrado'
);

create table historia_academica (
	id_alumne int,
	semestre text,
	id_materia int,
	id_comision int,
	estado char(15), -- `ausente',`reprobada',`regular',`aprobada'
	nota_regular int,
	nota_final int
);

create table error (
	id_error int,
	operacion char(15),
	-- `apertura',`alta inscrip',`baja inscrip',`cierre inscrip',
	-- `aplicacion cupo',`ingreso nota',`cierre cursada'
	semestre text,
	id_alumne int,
	id_materia int,
	id_comision int,
	f_error timestamp,
	motivo varchar(80)
);

create table envio_email (
	id_email int,
	f_generacion timestamp,
	email_alumne text,
	asunto text,
	cuerpo text,
	f_envio timestamp,
	estado char(10) -- `pendiente', `enviado'
);

create table entrada_trx (
	id_orden int, -- en qué orden se ejecutarán las transacciones
	operacion char(15),
	-- `apertura',`alta inscrip',`baja inscrip',`cierre inscrip',
	-- `aplicacion cupo',`ingreso nota',`cierre cursada'
	año int,
	nro_semestre int,
	id_alumne int,
	id_materia int,
	id_comision int,
	nota int
);

create sequence secuencia_error
start 1
increment 1;

create sequence secuencia_mail
start 1
increment 1;
