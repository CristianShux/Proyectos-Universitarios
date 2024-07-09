create or replace function aplicacion_de_cupos(_año int, _número_semestre int) returns boolean as $$
declare
	semestre_txt text := _año || '-' ||_número_semestre;
	estado_semestre text;
	v record;
	comision_cupo int;
	i int;

begin

	select estado into estado_semestre from periodo where semestre_txt = semestre;

	if not found or estado_semestre != 'cierre inscrip' then
		insert into error values(nextval('secuencia_error'), 'cierre inscrip', semestre_txt, null, null, null, current_timestamp, '?el semestre no se encuentra en un período válido para aplicar cupos.');
		return false;
	end if;

	for v in select * from (select id_materia, id_comision from cursada group by id_materia, id_comision having count(distinct id_alumne) > 0) comisiones_de_materias_con_inscriptos loop
		select cupo into comision_cupo from comision co where v.id_materia = co.id_materia and v.id_comision = co.id_comision;

		with alumnes_estudiantes_de_com_y_mat as (
			select id_alumne from cursada where estado = 'ingresade' and cursada.id_materia = v.id_materia and cursada.id_comision = v.id_comision limit comision_cupo
		)
		update cursada set estado = 'aceptade' where estado = 'ingresade' and cursada.id_materia = v.id_materia and cursada.id_comision = v.id_comision and cursada.id_alumne in (select id_alumne from alumnes_estudiantes_de_com_y_mat);

		update cursada set estado = 'en espera' where estado = 'ingresade' and cursada.id_materia = v.id_materia and cursada.id_comision = v.id_comision;
	
	end loop;
	
	update periodo set estado = 'cursada' where estado = 'cierre inscrip' and semestre = semestre_txt;

	return true;
end;
$$ language plpgsql
