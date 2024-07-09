create or replace function inscripcion_a_materia(_id_alumne int, _id_materia int, _id_comision int) returns boolean as $$
begin
	if not exists (select 1 from periodo where periodo.estado = 'inscripcion') then
		insert into error values (nextval('secuencia_error'), 'alta inscrip', null, null, null, null, current_timestamp, '?periodo de inscripcion cerrado');
		return false;
	end if;

	if not exists (select 1 from alumne where alumne.id_alumne = _id_alumne) then
		insert into error values (nextval('secuencia_error'), 'alta inscrip', null, _id_alumne, null, null, current_timestamp, '?id de alumne no valido');
		return false;
	end if;

	if not exists (select 1 from materia where materia.id_materia = _id_materia) then
		insert into error values (nextval('secuencia_error'), 'alta inscrip', null, null, _id_materia, null, current_timestamp, '?id de materia no valido');
		return false;
	end if;

	if not exists (select 1 from comision where comision.id_comision = _id_comision and comision.id_materia = _id_materia) then
		insert into error values (nextval('secuencia_error'), 'alta inscrip', null, null, _id_materia, _id_comision, current_timestamp, '?id de comision no valido para la materia');
		return false;
	end if;

	if exists (select 1 from cursada where cursada.id_alumne = _id_alumne and cursada.id_materia = _id_materia) then
		insert into error values (nextval('secuencia_error'), 'alta inscrip', null, _id_alumne, _id_materia, null, current_timestamp, '?alumne ya inscrito en la materia');
		return false;
	end if;

	if  exists (select 1 from correlatividad where correlatividad.id_materia=_id_materia) and exists (select 1 from correlatividad c where c.id_materia = _id_materia and not exists (select 1 from historia_academica h where h.id_alumne = _id_alumne and h.id_materia = c.id_mat_correlativa and  (h.estado = 'regular' or h.estado = 'aprobada'))) then
		insert into error values (nextval('secuencia_error'), 'alta inscrip', null, _id_alumne, _id_materia, null, current_timestamp, '?alumne no cumple requisitos de correlatividad');
		return false;
	end if;

	insert into cursada values (_id_materia, _id_alumne, _id_comision, current_timestamp, null, 'ingresade');

	return true;

end;
$$ language plpgsql;
