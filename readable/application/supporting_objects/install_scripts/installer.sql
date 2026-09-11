begin
    --CC: 10/10000 lignes exportées, APEX$DATA$PKG/CC$928211
    apex_data_install.load_supporting_object_data(p_table_name => 'CC', p_delete_after_install => true );
    --SUIVI_MODIF: 4/10000 lignes exportées, APEX$DATA$PKG/SUIVI_MODIF$744806
    apex_data_install.load_supporting_object_data(p_table_name => 'SUIVI_MODIF', p_delete_after_install => true );
    --T_USER: 3/10000 lignes exportées, APEX$DATA$PKG/T_USER$910132
    apex_data_install.load_supporting_object_data(p_table_name => 'T_USER', p_delete_after_install => true );
end;