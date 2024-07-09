create or replace function cierre_de_inscripcion(_año_solicitado int, _semestre_solicitado int) returns boolean as $$
declare
	semestre_txt text;

begin
	semestre_txt := _año_solicitado || '-' || _semestre_solicitado;

	if not exists (select 1 from periodo where periodo.semestre=semestre_txt and periodo.estado='inscripcion') then
		insert into error values (nextval('secuencia_error'),'cierre inscrip',semestre_txt,null,null,null,current_timestamp,'?el semestre no se encuentra en período de inscripcion');
		return false;
	end if;

	update periodo set estado='cierre inscrip' where periodo.semestre=semestre_txt;

	return true;

end;
$$ language plpgsql;
