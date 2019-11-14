import {SettingsModel} from 'app/core/model/settings.model';
import {ConfigModel} from 'app/core/model/config.model';

export interface ResponseApiModel<T> {
    config: ConfigModel;
    data: T[];
    settings: SettingsModel;
    access_token: string;
}