create or replace function ingreso_nota_de_cursada(_id_alumne int, _id_materia int, _id_comision int, nota_cursada int) returns boolean as $$
begin

	if not exists (select 1 from periodo p where p.estado = 'cursada') then
		insert into error values(nextval('secuencia_error'), 'ingreso nota', null, _id_alumne, _id_materia, _id_comision,  current_timestamp, '?periodo de cursada cerrado');
		return false;
	end if;

	if not exists (select 1 from cursada c where c.id_alumne = _id_alumne) then
		insert into error values(nextval('secuencia_error'), 'ingreso nota', null, _id_alumne, _id_materia, _id_comision,  current_timestamp, '?id de alumne no valido');
		return false;
	end if;

	if not exists (select 1 from cursada c where c.id_materia = _id_materia) then
		insert into error values(nextval('secuencia_error'), 'ingreso nota', null, _id_alumne, _id_materia, _id_comision,  current_timestamp, '?id de materia no valido');
		return false;
	end if;

	if not exists (select 1 from comision c where c.id_materia = _id_materia and id_comision = _id_comision) then
		insert into error values(nextval('secuencia_error'), 'ingreso nota', null, _id_alumne, _id_materia, _id_comision,  current_timestamp, '?id de comision no valido para la materia');
		return false;
	end if;

	if not exists (select 1 from cursada c where c.id_alumne = _id_alumne and c.id_materia = _id_materia and id_comision = _id_comision and c.estado = 'aceptade') then
		insert into error values(nextval('secuencia_error'), 'ingreso nota', null, _id_alumne, _id_materia, _id_comision,  current_timestamp, '?alumne no cursa en la comision');
		return false;
	end if;

	if nota_cursada > 10 or nota_cursada < 0 then
		insert into error values(nextval('secuencia_error'), 'ingreso nota', null, _id_alumne, _id_materia, _id_comision,  current_timestamp, '?nota no valida: ' || nota_cursada);
		return false;
	end if;

	update cursada set nota = nota_cursada where id_alumne = _id_alumne and id_materia = _id_materia and id_comision = _id_comision;

	return true;
end;

$$ language plpgsql
