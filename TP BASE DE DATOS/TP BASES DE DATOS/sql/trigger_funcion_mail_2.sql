create or replace function generacion_de_mail2() returns trigger as $$
declare
	mail text;
	cuerpo_email text;
	datos_alumne text;
	datos_materia text;
	datos_comision text;
	datos_h_academica text;

begin
	mail := (select email from alumne where id_alumne = old.id_alumne);
	datos_alumne := '' || (select generacion_datos_alumne(old.id_alumne));
	datos_materia := '' || (select id_materia from materia where id_materia = old.id_materia) || ' ' || (select nombre from materia where id_materia = old.id_materia) || E'\n';
	datos_comision := 'Comision: ' || (select id_comision from cursada where id_materia = old.id_materia and id_alumne = old.id_alumne);
	datos_h_academica := '' || (select generacion_datos_h_academica(old.id_alumne, old.id_materia, old.id_comision));
	cuerpo_email := datos_alumne || E'\n' || datos_materia || E'\n' || datos_comision || E'\n' || datos_h_academica;

	insert into envio_email values (nextval('secuencia_mail'), current_timestamp, mail, 'Cierre de cursada', cuerpo_email, null, 'pendiente');

	return new;
end;
$$ language plpgsql;

-- creación del trigger y asignación de la función al mismo
create trigger generacion_de_mail_trg2
before delete on cursada
for each row
when (old.estado = 'aceptade')
execute procedure generacion_de_mail2();
