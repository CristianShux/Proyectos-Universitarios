alter table envio_email drop constraint if exists envio_email_pk;

alter table error drop constraint if exists error_pk;

alter table historia_academica drop constraint if exists historia_academica_id_materia_fk;
alter table historia_academica drop constraint if exists historia_academica_semestre_fk;
alter table historia_academica drop constraint if exists historia_academica_id_alumne_fk;
alter table historia_academica drop constraint if exists historia_academica_pk;

alter table periodo drop constraint if exists periodo_pk;

alter table cursada drop constraint if exists cursada_id_alumne_fk;
alter table cursada drop constraint if exists cursada_id_materia_fk;
alter table cursada drop constraint if exists cursada_pk;

alter table comision drop constraint if exists comision_id_materia_fk;
alter table comision drop constraint if exists comision_pk;

alter table correlatividad drop constraint if exists correlatividad_pk;
alter table correlatividad drop constraint if exists materia_id_materia_fk;

alter table materia drop constraint if exists materia_pk;

alter table alumne drop constraint if exists alumne_pk;
