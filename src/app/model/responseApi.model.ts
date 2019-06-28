import {SettingsModel} from 'app/model/settings.model';
import {ConfigModel} from 'app/model/config.model';

export interface ResponseApiModel<T> {
    config: ConfigModel[];
    data: T[];
    settings: SettingsModel;
    access_token: string;
}