create or replace function generacion_datos_h_academica(_id_alumne int, _id_materia int, _id_comision int) returns text as $$
declare
	_semestre text;
	_estado text;
	_nota_regular int;
	_nota_final int;
	datos_h_academica text;

begin
	select semestre into _semestre from periodo order by semestre desc limit 1;
	select estado into _estado from historia_academica where id_alumne = _id_alumne and semestre = _semestre and id_materia = _id_materia and id_comision = _id_comision;
	select nota_regular into _nota_regular from historia_academica where id_alumne = _id_alumne and semestre = _semestre and id_materia = _id_materia and id_comision = _id_comision;
	select nota_final into _nota_final from historia_academica where id_alumne = _id_alumne and semestre = _semestre and id_materia = _id_materia and id_comision = _id_comision;

	if _estado = 'aprobada' then
		datos_h_academica := 'Estado: ' || _estado || E'\n' || 'Nota regular: ' || _nota_regular || E'\n' || 'Nota final: ' || _nota_final;
	else
		datos_h_academica := 'Estado: ' || _estado || E'\n' || 'Nota regular: ' || _nota_regular;
	end if;

	return datos_h_academica;
end;

$$ language plpgsql
