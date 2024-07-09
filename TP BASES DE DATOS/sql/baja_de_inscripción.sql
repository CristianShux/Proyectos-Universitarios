create or replace function baja_de_inscripcion(_id_alumne int, _id_materia int) returns boolean as $$	
declare
	esta_inscripto boolean;
	estado_periodo_actual text; 
	existe_alumno boolean;
	existe_materia boolean;
	id_alumne_en_espera int;
	id_comision_alumne_dado_de_baja int;
begin
	select estado into estado_periodo_actual from periodo order by semestre desc limit 1; 
	select exists(select 1 from alumne  where id_alumne = _id_alumne) into existe_alumno;
	select exists(select 1 from materia where id_materia = _id_materia) into existe_materia;
	select exists(select 1 from cursada where id_alumne = _id_alumne and id_materia = _id_materia) into esta_inscripto;

	if estado_periodo_actual != 'inscripcion' and estado_periodo_actual != 'cursada' then
		insert into error values(nextval('secuencia_error'), 'baja inscrip', null,null,null,null,current_timestamp,'No se permiten bajas en este periodo' );
		return false;
	end if;

	if not existe_alumno then
		insert into error values(nextval('secuencia_error'), 'baja inscrip', null,_id_alumne,null,null, current_timestamp,'Id de alumne no valido');
		return false;
	end if;

	if not existe_materia then
		insert into error values(nextval('secuencia_error'), 'baja inscrip', null, null, _id_materia,null,current_timestamp,'Id de materia no valido');
		return false;
	end if;

	if not esta_inscripto then
		insert into error values(nextval('secuencia_error'), 'baja inscrip', null,_id_alumne,_id_materia,null,current_timestamp,'Alumne no inscripte en la materia');
		return false;
	end if;

	update cursada set estado = 'dade de baja' where id_alumne = _id_alumne and id_materia = _id_materia;

	select id_comision into id_comision_alumne_dado_de_baja from cursada where id_alumne = _id_alumne and id_materia = _id_materia limit 1;

	select id_alumne into id_alumne_en_espera from cursada where id_materia = _id_materia and id_comision = id_comision_alumne_dado_de_baja and estado = 'en espera' order by f_inscripcion asc limit 1;

	if id_alumne_en_espera is not null then
		update cursada set estado = 'aceptade' where id_alumne = id_alumne_en_espera and id_materia = _id_materia and id_comision = id_comision_alumne_dado_de_baja;
	end if;

	return true;
end;
$$ language plpgsql;
