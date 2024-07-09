create or replace function generacion_de_mail() returns trigger as $$
declare
	mail text;
	cuerpo_email text;
	datos_alumne text;
	datos_materia text;
	datos_comision text;
begin
	mail := (select email from alumne where id_alumne = old.id_alumne);

	datos_alumne := '' || (select generacion_datos_alumne(old.id_alumne));
	datos_materia := '' || (select id_materia from materia where id_materia = old.id_materia) || ' ' || (select nombre from materia where id_materia = old.id_materia) || E'\n';
	datos_comision := 'Comision: ' || (select id_comision from cursada where id_materia = old.id_materia and id_alumne = old.id_alumne);
	cuerpo_email := datos_alumne || E'\n' || datos_materia || E'\n' || datos_comision || E'\n';

	if new.estado = 'ingresade' then
		insert into envio_email values (nextval('secuencia_mail'), current_timestamp, mail, 'Inscripcion registrada', cuerpo_email, null, 'pendiente');
	end if;

	if new.estado = 'dade de baja' then
		insert into envio_email values (nextval('secuencia_mail'), current_timestamp, mail, 'Inscripcion dada de baja', cuerpo_email, null, 'pendiente');
	end if;

	if old.estado = 'ingresade' and new.estado = 'aceptade' then
		cuerpo_email := cuerpo_email || E'\n' || 'La inscripcion se encuentra aceptada' || E'\n';
		insert into envio_email values (nextval('secuencia_mail'), current_timestamp, mail, 'Inscripcion aceptada', cuerpo_email, null, 'pendiente');
	end if;

	if new.estado = 'en espera' then
		cuerpo_email := cuerpo_email || E'\n' || 'La inscripcion se encuentra en espera, se te dara de alta ante la liberacion de algun cupo por baja' || E'\n';
		insert into envio_email values (nextval('secuencia_mail'), current_timestamp, mail, 'Inscripcion en espera', cuerpo_email, null, 'pendiente');
	end if;

	if old.estado = 'en espera' and new.estado = 'aceptade' then
		insert into envio_email values (nextval('secuencia_mail'), current_timestamp, mail, 'Inscripcion aceptada', cuerpo_email, null, 'pendiente');
	end if;

	return new;
end;
$$ language plpgsql;

-- creación del trigger y asignación de la función al mismo
create trigger generacion_de_mail_trg
after update on cursada
for each row
execute procedure generacion_de_mail();
