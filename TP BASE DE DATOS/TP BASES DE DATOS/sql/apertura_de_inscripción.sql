create or replace function apertura_de_inscripcion(_año int, _número_semestre int) returns boolean as $$
declare
	timestamp_actual timestamp;
	año_actual int;
	semestre_txt text;
	periodo_row periodo%rowtype;
begin
	select extract(year from current_timestamp)::int into año_actual;
	semestre_txt := _año || '-' || _número_semestre;
	select * into periodo_row from periodo where semestre_txt = semestre;

	if _año < año_actual then
		insert into error values(nextval('secuencia_error'), 'apertura', semestre_txt, null, null, null, current_timestamp, '?no se permiten inscripciones para un período anterior.');
		return false;
	end if;

	if _número_semestre != 1 and _número_semestre != 2 then
		insert into error values(nextval('secuencia_error'), 'apertura', semestre_txt, null, null, null, current_timestamp, '?número de semestre no válido.');
		return false;
	end if;

	if found and periodo_row.estado != 'cierre inscrip' then
		insert into error values(nextval('secuencia_error'), 'apertura', semestre_txt, null, null, null, current_timestamp, '?no es posible reabrir la inscripción del período, estado actual: ' || periodo_row.estado);
		return false;
	end if;

	if (select count(*) from periodo where semestre != semestre_txt and (estado = 'inscripcion' or estado = 'cierre inscrip')) > 0 then
		insert into error values(nextval('secuencia_error'), 'apertura', semestre_txt, null, null, null, current_timestamp, '?no es posible abrir otro período de inscripción, período actual: ' || semestre_txt);
		return false;
	end if;

	if found then
		update periodo set estado = 'inscripcion' where semestre = semestre_txt;
	else
		insert into periodo values(semestre_txt, 'inscripcion');
	end if;

	return true;
end;

$$ language plpgsql
