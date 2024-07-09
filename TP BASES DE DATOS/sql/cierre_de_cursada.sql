create or replace function cierre_de_cursada(_id_materia int, _id_comision int) returns boolean as $$
declare
	existe_materia boolean;
	existe_comision boolean;
	periodo_actual text;
	semestre_actual text;
	alumnes_en_comision int;
	notas_cargadas boolean;
	registro_cursada record;
	estado_hist_ac text;
begin

	select estado into periodo_actual from periodo order by semestre desc limit 1;

	select semestre into semestre_actual from periodo where estado = periodo_actual;

	select exists(select 1 from materia where id_materia = _id_materia) into existe_materia;

	select exists(select 1 from comision where id_materia = _id_materia and id_comision = _id_comision) into existe_comision;

	select count(*) into alumnes_en_comision from cursada where id_materia = _id_materia and id_comision = _id_comision;

	select not exists(select 1 from cursada where id_materia = _id_materia and id_comision = _id_comision and estado = 'aceptade' and nota is null) into notas_cargadas;

	if periodo_actual != 'cursada' then 
		insert into error values(nextval('secuencia_error'), 'cierre cursada', null,null,null,null,current_timestamp,'Periodo de cursada cerrado' );
		return false;
	end if;

	if not existe_materia then
		insert into error values(nextval('secuencia_error'), 'cierre cursada', null, null, _id_materia, null, current_timestamp, 'Id de materia no valido');
		return false;
	end if;

	if not existe_comision then
		insert into error values(nextval('secuencia_error'), 'cierre cursada', null, null, _id_materia, _id_comision, current_timestamp, 'Id de comision no valido para la materia');
		return false; 
	end if;

	if alumnes_en_comision <= 0 then
		insert into error values(nextval('secuencia_error'), 'cierre cursada', null, null, _id_materia, _id_comision, current_timestamp, 'Comision sin alumnes inscriptos');
		return false;
	end if;

	if not notas_cargadas then
		insert into error values(nextval('secuencia_error'), 'cierre cursada', null, null, _id_materia, _id_comision, current_timestamp, 'La carga de notas no esta completa');
		return false;
	end if;	

	for registro_cursada in select * from cursada where id_materia = _id_materia and id_comision = _id_comision and estado = 'aceptade' loop

		if registro_cursada.nota = 0 then
			estado_hist_ac := 'ausente';
			insert into historia_academica values(registro_cursada.id_alumne, semestre_actual, registro_cursada.id_materia, registro_cursada.id_comision, estado_hist_ac,null, null);
		end if;

		if registro_cursada.nota between 1 and 3 then
			estado_hist_ac := 'reprobada';
			insert into historia_academica values(registro_cursada.id_alumne, semestre_actual, registro_cursada.id_materia, registro_cursada.id_comision, estado_hist_ac,registro_cursada.nota, null);
		end if;

		if registro_cursada.nota between 4 and 6 then 
			estado_hist_ac := 'regular';
			insert into historia_academica values(registro_cursada.id_alumne, semestre_actual, registro_cursada.id_materia, registro_cursada.id_comision, estado_hist_ac,registro_cursada.nota, null);
		end if;

		if registro_cursada.nota between 7 and 10 then
			estado_hist_ac := 'aprobada';
			insert into historia_academica values(registro_cursada.id_alumne, semestre_actual, registro_cursada.id_materia, registro_cursada.id_comision, estado_hist_ac,registro_cursada.nota, registro_cursada.nota);
		end if;
	end loop;

	delete from cursada where id_materia = _id_materia and id_comision = _id_comision; 
	return true;
end;
$$ language plpgsql;
