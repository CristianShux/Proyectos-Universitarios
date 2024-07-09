create or replace function generacion_datos_alumne(_id_alumne int) returns text as $$
declare
	_nombre text;
	_apellido text;
	_dni int;
	_fecha_nacimiento date;
	_telefono text;
	datos_alumne text;

begin
	select nombre into _nombre from alumne where id_alumne = _id_alumne;
	select apellido into _apellido from alumne where id_alumne = _id_alumne;
	select dni into _dni from alumne where id_alumne = _id_alumne;
	select fecha_nacimiento into _fecha_nacimiento from alumne where id_alumne = _id_alumne;
	select telefono into _telefono from alumne where id_alumne = _id_alumne;

	datos_alumne := 'Alumne: ' || _nombre || ' ' || _apellido || ' ' || _dni || ' ' || _fecha_nacimiento || ' ' || _telefono;
	return datos_alumne;
end;

$$ language plpgsql
